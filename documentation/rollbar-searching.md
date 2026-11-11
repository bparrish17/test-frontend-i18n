# Searching for Specific Error Types in Rollbar

This document summarizes methods for filtering Rollbar items based on the error type (e.g., API errors, Component errors) using the standard search bar available on free tiers and the more advanced Rollbar Query Language (RQL) available on paid plans.

We've implemented custom data fields and standardized title prefixes to aid in this filtering:

*   **API Errors:** Title prefix `[API Error]`, custom field `isApiError: true`.
*   **Component Errors (Caught by ErrorBoundary):** Title prefix `[Component]`, custom field `componentName: 'ActualComponentName'`.
*   **Manually Reported Errors:** Title prefix `[Manual]` (or other relevant type like `[Upload]`).

## Standard Rollbar Search (Free Tier)

The standard search bar offers keyword-based searching and specific field filtering.

### Filtering by Title Keyword

Search for items whose title contains specific keywords. This is useful for our standardized prefixes:

*   **Component Errors:** `[Component]`
*   **API Errors:** `[API Error]`
*   **Manual Errors:** `[Manual]`
*   **Upload Errors:** `[Upload]`

*Note: This is an infix search, so `[Component]` will match titles like `Error: [Component] MyComponent`.*

### Filtering by Custom Field Value

You can search for specific values within your custom data using the `custom[key]:value` syntax.

*   **Specific Component Error:** `custom[componentName]:MySpecificComponent`
*   **Find any API Error:** `custom[isApiError]:true`
*   **Component Errors containing "page":** `custom[componentName]:%page%` (Uses wildcard)

### Filtering by Custom Field Existence (Workaround)

While a direct `has:custom.fieldName` syntax for checking the existence of a custom field isn't reliably documented or confirmed to work consistently for custom fields in the standard search, you can achieve a similar result using a wildcard search for *any* value within that field:

*   **All Component Errors (that have `componentName`):** `custom[componentName]:%`
*   **All API Errors (that have `isApiError`):** `custom[isApiError]:%` (Alternatively, `custom[isApiError]:true` is more direct if the value is always boolean true).

*(Source: [https://docs.rollbar.com/docs/search-items#section-searching-custom-fields](https://docs.rollbar.com/docs/search-items#section-searching-custom-fields), [https://rollbar.com/blog/custom-field-search/](https://rollbar.com/blog/custom-field-search/))*

## Rollbar Query Language (RQL) (Paid Plans)

*Note: RQL is part of Rollbar Analyze and requires an Advanced or Enterprise plan. It is not available on the free tier.*

RQL provides a more powerful SQL-like interface for querying occurrence data.

### Filtering by Custom Field

*   **Component Errors (Existence):**
    ```sql
    SELECT * 
    FROM item_occurrence 
    WHERE custom.componentName IS NOT NULL
    ```
*   **Component Errors (Specific):**
    ```sql
    SELECT * 
    FROM item_occurrence 
    WHERE custom.componentName = 'MySpecificComponent'
    ```
*   **API Errors:**
    ```sql
    SELECT * 
    FROM item_occurrence 
    WHERE custom.isApiError = true
    ```

### Filtering by Item Title (using LIKE)

*   **Component Errors:**
    ```sql
    SELECT * 
    FROM item_occurrence 
    WHERE item.title LIKE '%[Component]%'
    ```
*   **API Errors:**
    ```sql
    SELECT * 
    FROM item_occurrence 
    WHERE item.title LIKE '%[API Error]%'
    ```

*(Source: [https://docs.rollbar.com/docs/rql](https://docs.rollbar.com/docs/rql))*

## Experimental / Uncertain Search Methods

These methods were considered but may not work as expected:

*   **Standard Search `has:` for Custom Fields:** The syntax `has:custom.componentName` is documented for built-in fields like `comments` or `issue` but its reliability for custom fields is unclear from documentation and testing.
*   **RQL `CONTAINS` for Arrays:** The query `SELECT * FROM item_occurrence WHERE custom.errorCategory CONTAINS 'ErrorBoundary'` uses standard SQL syntax, but it's uncertain if RQL specifically supports the `CONTAINS` function (or similar array functions) in the `WHERE` clause for custom array fields. 