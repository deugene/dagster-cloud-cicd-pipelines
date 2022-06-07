# Update Only Example

This is a minimal example of a repo set up to use the update only pipeline. This action relies on a new image already built and pushed.
The tag for this image must be specified with the `imageTag` parameter, which is then responsible for notifying Dagster Cloud that a new image is ready to use.
