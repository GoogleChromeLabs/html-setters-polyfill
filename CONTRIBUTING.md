# How to contribute

We'd love to accept your patches and contributions to this project.

## Before you begin

### Sign our Contributor License Agreement

Contributions to this project must be accompanied by a
[Contributor License Agreement](https://cla.developers.google.com/about) (CLA).
You (or your employer) retain the copyright to your contribution; this simply
gives us permission to use and redistribute your contributions as part of the
project.

If you or your current employer have already signed the Google CLA (even if it
was for a different project), you probably don't need to do it again.

Visit <https://cla.developers.google.com/> to see your current agreements or to
sign a new one.

### Review our community guidelines

This project follows
[Google's Open Source Community Guidelines](https://opensource.google/conduct/).

## Contribution process

### Build

The only build step is minification. Use `uglify-js`:

```bash
npm install
npm run build
```

### Testing

WPT tests are imported into the `tests/` directory and adjusted to not require the WPT infra.

To test the full suite run:

- `npm run test:server`

And then in a separate terminal you can test local tests:

- `npm run test:unit`

To test a subset of browsers or tests, run commands like the following:

- `npm run test:unit -- --browsers=chrome`
- `npm run test:unit -- --browsers=chrome --tests=test-01`
- `npm run test:unit -- --browsers=chrome --tests=nested`

New tests should be added for all new functionality either locally or via WPTs (preferred).

### Code reviews

All submissions, including submissions by project members, require review. We
use GitHub pull requests for this purpose. Consult
[GitHub Help](https://help.github.com/articles/about-pull-requests/) for more
information on using pull requests.
