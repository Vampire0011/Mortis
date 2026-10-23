const base = { summary: '', softSkills: [], github: '', linkedin: '', portfolio: '', resume: null, resumeVisibility: 'Private', showContact: false, photo: '', sections: { education: [], internships: [], workshops: [], competitions: [], volunteer: [] }, status: 'Active' }
export const students = [
  { ...base, id: 'STU001', name: 'Aarav Sharma', email: 'aarav.sharma@uni.edu', emailType: 'University', dept: 'CSE', course: 'B.Tech CSE', year: '3rd Year', classId: 'CSE-3A',
    summary: 'Third-year CSE student interested in web development and cloud computing.', skills: ['React', 'JavaScript', 'Python', 'SQL'], softSkills: ['Teamwork', 'Communication'],
    github: 'https://github.com/aarav-demo', linkedin: 'https://linkedin.com/in/aarav-demo', portfolio: '',
    sections: { education: ['B.Tech CSE, 2023-2027'], internships: ['Web Intern, TechNova (Summer 2025)'], workshops: ['Cloud Workshop 2025'], competitions: ['Smart India Hackathon - Finalist'], volunteer: ['NSS Volunteer'] } },
  { ...base, id: 'STU002', name: 'Diya Patel', email: 'diya.patel@uni.edu', emailType: 'University', dept: 'CSE', course: 'B.Tech CSE', year: '3rd Year', classId: 'CSE-3A',
    summary: 'Machine learning enthusiast and open-source contributor.', skills: ['Python', 'TensorFlow', 'Data Analysis'], softSkills: ['Leadership'], github: 'https://github.com/diya-demo' },
  { ...base, id: 'STU003', name: 'Kabir Singh', email: 'kabir.singh@uni.edu', emailType: 'University', dept: 'CSE', course: 'B.Tech CSE', year: '3rd Year', classId: 'CSE-3B',
    summary: 'Competitive programmer and hackathon regular.', skills: ['C++', 'Algorithms', 'Java'], softSkills: ['Problem solving'] },
  { ...base, id: 'STU004', name: 'Meera Nair', email: 'meera.nair@uni.edu', emailType: 'University', dept: 'ECE', course: 'B.Tech ECE', year: '3rd Year', classId: 'ECE-3A',
    summary: 'Embedded systems and IoT learner.', skills: ['Arduino', 'Embedded C', 'PCB Design'], softSkills: ['Creativity'] },
  { ...base, id: 'STU005', name: 'Rohan Verma', email: 'rohan.verma@uni.edu', emailType: 'University', dept: 'ME', course: 'B.Tech ME', year: '3rd Year', classId: 'ME-3A',
    summary: 'Robotics club member and sports captain.', skills: ['CAD', 'SolidWorks', 'Robotics'], softSkills: ['Leadership', 'Discipline'] },
  { ...base, id: 'STU006', name: 'Ananya Rao', email: 'ananya.rao@uni.edu', emailType: 'University', dept: 'CSE', course: 'B.Tech CSE', year: '3rd Year', classId: 'CSE-3B',
    summary: 'UI/UX and frontend developer; volunteers for education drives.', skills: ['Figma', 'React', 'CSS'], softSkills: ['Empathy'] },
  { ...base, id: 'STU007', name: 'Vikram Joshi', email: 'vikram.joshi@uni.edu', emailType: 'University', dept: 'ECE', course: 'B.Tech ECE', year: '3rd Year', classId: 'ECE-3A',
    summary: 'Signal processing and communications enthusiast.', skills: ['MATLAB', 'DSP', 'Python'], softSkills: ['Research'] },
]
