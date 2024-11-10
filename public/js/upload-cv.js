/**
 * Handles the CV upload process and updates the UI with results.
 * @param {number} jobId - The job ID for the upload context.
 */
function uploadCV(jobId) {

    const typewriterElement = document.getElementById('typewriter');
    typewriterElement.innerHTML = "";

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/pdf';
    fileInput.onchange = async () => {
        const file = fileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            // Show loading spinner
            const uploadResultDiv = document.getElementById('upload-result');
            uploadResultDiv.innerHTML = '<p>Analyzing... <span class="loading-spinner"></span></p>';
            uploadResultDiv.style.display = 'block';

            try {
                const response = await fetch(`https://ai-cv-analyze-53c45a6064cc.herokuapp.com/api/cv/${jobId}/upload`, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (response.ok) {
                    
                    displayUploadResult(result);
                    typeText(result);
                    displaySimilarJobs(result.similarjobs); 
                } else {
                    showCustomAlert(`Error uploading CV: ${result.error || 'Unknown error'}`, 'error');
                    uploadResultDiv.style.display = 'none';
                }
            } catch (error) {
                console.error('Upload error:', error);
                showCustomAlert('An error occurred while uploading the CV.', 'error');
                uploadResultDiv.style.display = 'none';
            }
        }
    };
    fileInput.click();
}


/**
 * Displays the results of the CV upload analysis.
 * @param {object} result - The result object returned by the API.
 */

function displayUploadResult(result) {
    var data = result.data;

    const uploadResultDiv = document.getElementById('upload-result');

    uploadResultDiv.innerHTML = `
        <h3>Analyze Result</h3>
        <p><strong>Keywords:</strong> ${Array.isArray(data.keywords) ? data.keywords.join(', ') : 'No keywords provided'}</p>
        <p><strong>Job Sector:</strong> ${data.job_sector}</p>
        <p><strong>AI Suitability Score:</strong> ${data.AI_SuitabilityScore}%</p>
        <div style="margin: 10px 0;">
            <div style="background-color: #f3f3f3; border-radius: 10px; overflow: hidden; width: 100%; height: 20px;">
                <div style="background-color: #4caf50; height: 100%; width: ${data.AI_SuitabilityScore}%;"></div>
            </div>
        </div>
        <p>
            <strong>Proficiency Level:</strong>
            <span class="badge" style="background-color: ${getProficiencyColor(data.AI_ProficiencyLevel)};">
                ${data.AI_ProficiencyLevel}
            </span>
        </p>
        <div>
            <div id="pdf-render-container" style="border: 1px solid #ccc; border-radius: 10px; overflow: hidden;"></div>
        </div>

    `;
    renderPDF(result.filePath);
    uploadResultDiv.style.display = 'block';


}


/**
 * Dynamically renders the list of similar jobs in the job-list container.
 * @param {Array} jobs - List of similar job objects.
 */
function displaySimilarJobs(jobs) {
    const jobListContainer = document.querySelector('.job-list');
    jobListContainer.innerHTML = ""; // Clear the container before populating

    if (jobs && jobs.length > 0) {
        jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.classList.add('job-card');
            jobCard.onclick = () => jobDetail(job.jobid);

            jobCard.innerHTML = `
                <h3 class="job-title">${job.title}</h3>
                <p class="job-detail"><i class="fas fa-info-circle"></i> ${job.description}</p>
                <p class="job-detail"><i class="fas fa-building"></i> <strong>Department:</strong> ${job.department}</p>
                <p class="job-detail"><i class="fas fa-location-dot"></i> <strong>Location:</strong> ${job.location}</p>
                <p class="job-detail"><i class="fas fa-briefcase"></i> <strong>Employment Type:</strong> ${job.employmenttype}</p>
                <p class="job-detail"><i class="fas fa-calendar-alt"></i> <strong>Posted Date:</strong> ${new Date(job.posteddate).toLocaleDateString()}</p>
                <p class="job-detail"><i class="fas fa-percentage"></i> <strong>Similarity:</strong> ${(job.similarity * 100).toFixed(2)}%</p>
            `;

            jobListContainer.appendChild(jobCard);
        });
    } else {
        jobListContainer.innerHTML = "<p>No similar jobs found.</p>";
    }
}


function jobDetail(jobId) {
    // Redirect to the CV upload page with job ID as parameter
    window.location.href = '/job/' + jobId;
}