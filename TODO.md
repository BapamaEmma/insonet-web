# Form Validation Fix TODO

## Status: In Progress

1. [ ] **Update main.js**: Overhaul validation logic - remove HTML5 dependency, implement custom validateField with rules (phone optional everywhere), update selectors to data-required, enhance error reporting.
2. [ ] **Read and update styles.css**: Ensure .error/.valid styles exist, add error message display.
3. [ ] **Edit all HTML forms**:
   - Remove: required, minlength, novalidate from all inputs/forms.
   - Add: data-required='true' to: fullName (all), email (contact/index), serviceType (index), message (all).
   - Ensure #form-errors div in each form.
   - Files: index.html, contact.html, cctv.html, network.html, access.html, cyber.html, fencing.html, hardware.html, services.html.
4. [ ] **Test**: Serve site, test all forms (fill invalid/valid, submit, phone no validation).
5. [ ] **Complete**: attempt_completion.

## Notes
- Phone: fully optional, no validation.
- Modern: real-time feedback, aria-invalid, live errors, shake only on submit fail.

