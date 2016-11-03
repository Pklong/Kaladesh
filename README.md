
## General Guidelines
This is a Frontend developer competency test designed to gauge skill, attention to detail and affinity for standards based development.

- The code should follow best practices
- You may use any libraries or frameworks that you want for this task - but prepare to motivate your choices in the follow-up interview.
- Project structuring and setup files have been omitted.  We would like to see how you think about project organization.
- Even though this is a small project, treat it with the mindset of a larger one.
- Commit your progress often.
- Your submission should include a readme-file with instructions on how to install & get started.

## Implementation Details
1. Populate the page with data from `articles.json`.  Initially show 10 of the 30 articles that are populated.
1. At the bottom of the table should be a way to show 10 more rows.  If there are no more articles to show from the bootstrapped data, then make an xhr request to `more-articles.json` and dynamically add them to the table, 10 at a time.
1. Allow the user to sort the table via the `words` and `submitted` columns.
1. If a user leaves the page and then returns, their previous sorting choice should be automatically set.
