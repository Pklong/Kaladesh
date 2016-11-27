## Implementation Requirements
1. Populate the page with data from `articles.json`.  Initially show 10 of the 30 articles that are populated.
1. At the bottom of the table should be a way to show 10 more rows.  If there are no more articles to show from the bootstrapped data, then make an xhr request to `more-articles.json` and dynamically add them to the table, 10 at a time.
1. Allow the user to sort the table via the `words` and `submitted` columns.
1. If a user leaves the page and then returns, their previous sorting choice should be automatically set.
