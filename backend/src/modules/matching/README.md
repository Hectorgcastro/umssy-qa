# Epic 5: matching

The implementation uses the existing PostgreSQL profile, not values submitted by the browser.

Score weights: skills 60, academic qualifications 25, experience 10, other requirements 5.
Only categories with requirements participate. Score = round(100 * sum(weight * fulfilled / required) / sum(participating weights)). No requirements means 100%; unmet requirements mean 0%. Requirements are deduplicated, case/accent normalized; skill aliases use the dictionary. Academic qualifications use exact normalized equality, never substring matching or an institution name.

Experience is the union of employment periods, so simultaneous positions are not counted twice. Future periods contribute zero. Documents without evidence remain pending. The current profile schema has no opportunity document-submission relation; other requirements remain pending until that feature exists.

Ranking compares career match, experience match, number of matching skills, then id for deterministic ties. Pagination runs after ranking.

Apply the new migration and generate the Prisma client before starting the API. This migration creates the Vacancy table if absent and adds minExperienceYears; reconcile the pending #573 migration before integrating both PRs.
