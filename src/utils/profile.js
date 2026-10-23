// Profile completion percentage (simple checklist - edit as you like)
export function completion(u, certCount = 0) {
  const checks = [u.summary, u.skills?.length, u.softSkills?.length, u.github, u.linkedin, u.portfolio, u.resume, u.sections?.education?.length, u.sections?.internships?.length, certCount > 0]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}
