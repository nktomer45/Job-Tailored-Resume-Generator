// run-service-node.ts
import { generateTailoredResume } from './geminiService'; // Adjust path if needed

async function main() {
  if (!process.env.API_KEY) {
    process.env.API_KEY= "AIzaSyCt0EI9eJf2F-3FYxyHVjH3VtIFN-5JHf8"
    console.error(
      "ERROR: API_KEY environment variable is not set.\n" +
      "Please set it before running the script, e.g.:\n"
    );
    // return;
  }

  const sampleOriginalResume = `
    Software Engineer
    City, State | (123) 456-7890 | email@example.com | linkedin.com/in/username

    Summary
    Innovative Software Engineer with 3 years of experience in developing and deploying web applications. Proficient in JavaScript, Python, and cloud technologies.

    Experience
    Tech Solutions Inc. - Software Engineer | Jan 2021 - Present
    - Developed new features for a SaaS product, improving user engagement by 10%.
    - Collaborated with a team of 5 engineers in an Agile environment.

    Education
    University of Technology - B.S. in Computer Science | 2020
  `;

  const sampleJobDescription = `
    Senior Software Engineer - Cloud Services

    We are looking for a Senior Software Engineer with a strong background in cloud computing (AWS/Azure/GCP) and experience building microservices.
    The ideal candidate will have 5+ years of experience, proficiency in Go or Java, and a passion for scalable systems.
    Responsibilities include designing, developing, and deploying backend services.
    Strong problem-solving skills and excellent communication are required.
  `;

  const sampleCareerStartDate = "2021"; // Or "01/2021"

  console.log("Attempting to generate tailored resume in Node.js environment...");

  try {
    const tailoredResume = await generateTailoredResume(
      sampleOriginalResume,
      sampleJobDescription,
      sampleCareerStartDate
    );
    console.log("\n--- Generated Tailored Resume ---");
    console.log(tailoredResume);
  } catch (error) {
    console.error("\n--- Error during resume generation ---");
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      if (error.stack) {
        console.error("Stack trace:", error.stack);
      }
    } else {
      console.error("An unknown error occurred:", error);
    }
  }
}

main();