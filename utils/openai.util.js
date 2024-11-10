const axios = require('axios');
require('dotenv').config();
const OPENAI_TOKEN= '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'

function getTextEmbedding(text) {
    return new Promise(async function(resolve, reject) {
        var config = {
            method: 'post',
            url: 'https://api.openai.com/v1/embeddings',
            headers: { 
                'Authorization': `Bearer ${OPENAI_TOKEN}`, 
                'Content-Type': 'application/json'
            },
            data : {
                input: text,
                model:  "text-embedding-3-small"//"text-embedding-ada-002",//"text-curie-001",//"text-ada-001",//"text-davinci-003",
            }
            };
            axios(config).then(async function (response) {
                if (response.data && response.data.data && response.data.data[0].embedding) {
                    const embeddingArray = Array.from(response.data.data[0].embedding); // Convert to array if needed
                    resolve(embeddingArray);
                } else {
                    reject("No embedding data found in response");
                }
            })
            .catch(async function (error) {
                console.log(error);
            resolve(null)
            });
    })
}

function getTextEmbedding2(text) {
    return new Promise((resolve, reject) => {
        const config = {
            method: 'post',
            url: 'https://api.openai.com/v1/embeddings',
            headers: { 
                'Authorization': `Bearer ${OPENAI_TOKEN}`, 
                'Content-Type': 'application/json'
            },
            data: {
                input: text,
                model: "text-embedding-3-small"
            }
        };

        axios(config)
            .then(response => {
                if (response.data && response.data.data && response.data.data[0].embedding) {
                    const embeddingArray = response.data.data[0].embedding;
                    resolve(embeddingArray);
                } else {
                    reject(new Error("No embedding data found in response"));
                }
            })
            .catch(error => {
                console.error("Error fetching embedding:", error.message);
                reject(error); // Properly reject on error
            });
    });
}



function getGVJsonData(rawdata) {

    return new Promise(async function(resolve, reject) {
        const config = {
            method: 'post',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: { 
                'Authorization': `Bearer ${OPENAI_TOKEN}`, 
                'Content-Type': 'application/json'
            },
            data: {
                model: "gpt-3.5-turbo",//"gpt-4", // Or "gpt-3.5-turbo" if using the GPT-3.5 model
                messages: [
                    { role: "system", content: "Extract the following information in JSON format from the text below and also provide a numerical CV quality score (cv_score) from 1 to 10, where 10 is excellent." },
                    { role: "user", content: `{
                        "Firstname": "First name",
                        "Lastname": "Last name",
                        "Email": "Email address",
                        "Phone": "Mobile phone number",
                        "LinkedIn": "LinkedIn profile",
                        "TopSkills": [
                            "Skill 1",
                            "Skill 2",
                            "Skill 3"
                        ],
                        "Languages": [
                            {
                                "Language": "Language name",
                                "Proficiency": "Proficiency level"
                            }
                        ],
                        "Publications": [
                            {
                                "Title": "Publication title",
                                "Description": "Publication description"
                            }
                        ],
                        "Summary": "Professional summary",
                        "CompanyRoles": [
                            {
                                "Company": "Company name",
                                "Position": "Position",
                                "Start": "Start date",
                                "End": "End date",
                                "Location": "Location"
                            }
                        ],
                        "Education": [
                            {
                                "Institution": "Institution name",
                                "Degree": "Degree",
                                "Field": "Field of study",
                                "StartYear": "Start year",
                                "EndYear": "End year"
                            }
                        ],
                        "cv_score": "Numeric rating from 1 to 10"
                    }\n\nText:\n"${rawdata}"` }
                ],
                max_tokens: 800,
                temperature: 0  // Lower temperature for more factual output
            }
        };

        try {
            const response = await axios(config);
        //    console.log(response)
            const result = response.data.choices[0].message.content.trim();
            return resolve(JSON.parse(result));
        } catch (error) {
            console.error('Error generating structured JSON:', error);
            reject(error);
        }
    });

}






module.exports = { getTextEmbedding, getGVJsonData,  getTextEmbedding2 };