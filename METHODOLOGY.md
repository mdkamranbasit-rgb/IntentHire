# Growth For Impact Resume Screening Prototype — Methodology (v1)

## Dataset integrity
- Source archive: Software Development Assignment Resumes.zip
- DOCX resumes in archive: 47
- Original archive is preserved unchanged. Files are processed from a separate working copy.
- Text extraction: python-docx paragraphs and tables.
- Extraction status: 46 readable; 1 blank_or_unreadable (`anonymized_resume_1793685080327.docx`).
- No missing information is fabricated. Unreadable files remain in the dataset and require human review.

## Job description source interpretation
### LCA Consultant
The detailed JD states 2–3 years independently running LCA projects, hands-on GaBi or SimaPro, at least 3 completed LCA projects, and ISO 14040/14044. It also emphasizes LCI collection/validation, modelling, traceable assumptions, operational data, benchmarking, environmental education, onsite Chennai, travel, and one-year commitment. The assignment overview separately labels this profile as 4–6 years. This discrepancy is retained for human review; this v1 evidence score does not silently choose one threshold.

### UI/UX Design Intern
The JD accepts 0–1 year. It emphasizes UI/UX principles, human-centered design, Figma and prototyping, user psychology/behavior, aesthetic sense, attention to detail, responsive interfaces, research, collaboration, and design projects.

## Initial scoring approach
The first-pass scores are deterministic evidence-coverage scores, not an AI-generated judgment and not proof that a candidate's claims are true. Each criterion contributes a fixed weight. A matching phrase gives partial credit; multiple distinct matching signals give full credit. Evidence phrases are retained in JSON for auditability.

### LCA weights
- Direct LCA work: 25
- LCA software signals: 20
- LCI data and modelling: 15
- ISO 14040/14044: 15
- Relevant education: 10
- EPD and benchmarking: 5
- Relevant industry experience: 10

### UI/UX weights
- Figma/design tools: 15
- Prototyping/wireframes: 15
- User research/testing: 15
- User psychology/human-centered design: 10
- Interface design: 15
- Visual design: 10
- Design projects/portfolio: 15
- Responsive design/collaboration: 5

## Classification thresholds (provisional)
- Stronger role match: score >=60 and at least 15 points above the other role.
- Potential match for both: both scores >=45.
- Neither/uncertain: both scores <30 or extraction failed.
- Other cases are sent for human review.

## Limitations and required human QA
- Keyword evidence can miss synonyms and context; it can also match a term in a weak context.
- Years of experience, independent project ownership, exact number of completed LCA projects, and tool proficiency require date/context validation.
- A resume score is not a hiring decision. Reviewers must inspect the source resume and can override classifications.
- The LCA JD's 2–3 vs 4–6 years discrepancy must be resolved by the hiring team before final shortlisting.
- The initial thresholds and weights are provisional and should be tested on a manually reviewed sample before production use.
