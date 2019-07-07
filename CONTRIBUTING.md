# Contributing
All contributions are welcome.

## Bugfixes
Simply submit a pull request when you want to fix a bug in the code.
If an issue for the bug exists, mention the issue # in your PR.

If this is a user-facing issue and the existing tests did not pick up 
on it, consider writing additional tests so similar bugs can be caught
more quickly in the future.

## New features
When adding new features to the project, please discuss the feature you
want to add in an issue first, before submitting a pull request.

In most cases I'll gladly say 'go ahead', but some features may not 
match the goal or vision for this project, or may need additional 
consideration because of specific implementation details.

### Tests
This project uses test-driven development for the Monta template syntax 
and the exported functionality of the modules. This means, when adding 
new syntax or new features, a test is written first, and the code is
then updated to make the new test pass.

This helps keep the template syntax easy and user-friendly, since it 
makes you think about the preferred syntax first, rather than the 
technical implementation.

So when adding new syntax or features, consider doing the same. But 
even if you don't use test-driven development, you should still write
tests for the added or changed features, to catch any bugs or 
incompatibilities that may be introduced later.  
