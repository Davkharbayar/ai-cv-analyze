
const { body, validationResult } = require('express-validator');
const { pdfFileUpload }= require("../../utils/file.util");
const  {getPdfData} = require("../../utils/pdf.util");
const  {getTextEmbedding, getGVJsonData, getTextEmbedding2} = require("../../utils/openai.util");
const pool = require("../../config/database");




exports.uploadCV = async(req, res, next) =>{
    try {
        const filePath = await pdfFileUpload(req, '/files/cv/');
        const  jobId = req.params.jobId;
        if (!filePath) {

            return res.status(400).send({ error: 'File upload failed' });
        }
        var data =  await getPdfData(filePath);
        var data2 = await getCVPrediction(jobId, data.cleanedText);
        const candidateData =   JSON.parse(data2.prediction.replace(/```json\n|```/g, ''));
        await createCandidate(candidateData, filePath, jobId);
        var similarjobs =await getCVSimilarJobs(candidateData.keywords)
        res.status(200).send({ data :  candidateData, filePath : filePath, similarjobs : similarjobs});


    } catch (error) {
        console.error('Error in uploadCV:', error);
        res.status(500).send({ 
            error: 'Internal Server Error',
            message: error.message || 'An unexpected error occurred. Please try again later.' 
        });
        next(error);
    }
}



async function getCVPrediction(jobId, cvdata) {
    try {
        console.log(`Job ID: ${jobId}`);
        
        const query = `
            SELECT ai.openai_chat_complete(
                'gpt-3.5-turbo',
                jsonb_build_array(
                    jsonb_build_object('role', 'system', 'content', 'you are a helpful assistant robot only return json'),
                    jsonb_build_object('role', 'system', 'content', 'You are a robot assistant that helps you get a new job'),
                    jsonb_build_object('role', 'system', 'content', 'If there is a similar job, you can recommend it'),
                    jsonb_build_object('role', 'system', 'content', 'We will analyze and answer only from our database'),
                    jsonb_build_object('role', 'system', 'content', 'If there is a name in the summary section, the name must be included. If the score is below 60 points,
                    it is considered unsuitable for the job. advise on the necessary skills to acquire'),
                    jsonb_build_object(
                        'role', 'system', 
                        'content', 
                        (
                            SELECT STRING_AGG(
                                jsonb_build_object(
                                    'jobid', jobid,
                                    'Title', Title,
                                    'Description', Description,
                                    'Department', Department,
                                    'Requirements', Requirements,
                                    'Status', status
                                )::TEXT, ', '
                            )
                            FROM JobPostings
                        )
                    ),
                    jsonb_build_object('role', 'system', 'content', 'Determine whether the job is suitable and write a conclusion, expressing it as a percentage'),
                    jsonb_build_object('role', 'system', 'content', 'Also explain whether ${jobId} jobid is suitable for the position '),
                    jsonb_build_object('role', 'system', 'content', 'Extract the following information in JSON format from the text below and also provide a numerical job matching score (AI_SuitabilityScore) from 0 to 100, where 100 is matched.
                    {
                        firstname : firstname,
                        lastname : lastname,
                        email : email,
                        phone : phone,
                        LinkedIn : LinkedIn,
                        keywords : keywords,
                        job_sector : job_sector,
                        AI_SuitabilityScore : AI_SuitabilityScore,
                        AI_ProficiencyLevel : Beginner, Intermediate, Advanced, Expert,
                        AI_Summary : reason
                    }'),                
                    jsonb_build_object('role', 'user', 'content', $1::TEXT)
                )
            )->'choices'->0->'message'->>'content' AS prediction;
        `;

        const result = await pool.query(query, [cvdata]);

        if (!result.rows.length || !result.rows[0].prediction) {
            return { message: "No prediction available for the provided data." };
        }

        return {
            prediction: result.rows[0].prediction,
            
        };
    } catch (error) {
        console.error('Error in getCVPrediction:', error);
        throw new Error('An error occurred while processing the CV prediction.');
    }
}



/**
 * Fetch similar jobs based on CV keywords
 */

async function getCVSimilarJobs(keywords) {
    try {


        console.log(keywords);
        const embeddingArray = await getTextEmbedding2(keywords);
        if (!embeddingArray) throw new Error('Failed to retrieve embedding data.');

        const formattedEmbedding = `[${embeddingArray.join(",")}]`;

        const query = `
            SELECT 
                jobid, title, description, department, location, employmenttype, posteddate,
                embedding <=> $1 AS similarity
            FROM 
                jobpostings 
            WHERE 
                status = 'Open'
            ORDER BY 
                similarity DESC
            LIMIT 3
        `;

        const result = await pool.query(query, [formattedEmbedding]);
        return result.rows;
    } catch (error) {
        console.error('Error in getCVSimilarJobs:', error);
        throw new Error('An error occurred while retrieving similar jobs.');
    }
}




/**
 * Create a new candidate entry
 */
async function createCandidate(params, cvPath, jobId) {
    const {
        firstname,
        lastname,
        email,
        phone,
        LinkedIn,
        keywords,
        job_sector,
        AI_SuitabilityScore,
        AI_ProficiencyLevel,
        AI_Summary,
    } = params;

    const keywordJson = keywords.join(", ");

    const query = `
        INSERT INTO candidates (
            firstname, lastname, email, phone, resumepath, ai_suitabilityscore, ai_summary,
            ai_proficiencylevel, jobid, keyword, linkedin, job_sector
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id
    `;

    const values = [
        firstname, lastname, email, phone, cvPath, AI_SuitabilityScore, AI_Summary,
        AI_ProficiencyLevel, jobId, keywordJson, LinkedIn, job_sector,
    ];

    try {
        const result = await pool.query(query, values);
        console.log('Candidate CV saved with ID:', result.rows[0].id);
        return result.rows[0].id;
    } catch (error) {
        console.error('Error in createCandidate:', error);
        throw new Error('Failed to save candidate data.');
    }
}

