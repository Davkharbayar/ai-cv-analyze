
const { body, validationResult } = require('express-validator');
const { pdfFileUpload }= require("../../utils/file.util");
const  {getPdfData} = require("../../utils/pdf.util");
const pool = require("../../config/database");


exports.list = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT jobid, title, description, department, location, employmenttype,posteddate FROM 
                jobpostings WHERE status = 'Open' ORDER BY posteddate`,
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error during CV search:", err);
        res.status(500).json({ error: "An error occurred while searching for CVs." });
    }
};



exports.detail = async (req, res, next) => {
    try {
        const { jobid } = req.params;
        const query = `
            SELECT jobid, title, description, department, location, employmenttype, posteddate, requirements
            FROM jobpostings
            WHERE jobid = $1
            LIMIT 1
        `;
        const { rows } = await pool.query(query, [jobid]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Job posting not found." });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error during job detail retrieval:", error);
        res.status(500).json({ error: "An error occurred while retrieving the job details." });
    }
};

