const handlebars = require('handlebars');

module.exports = {
  commitFilesToBranch,
};

async function commitFilesToBranch(config) {
  const updatedFiles = config.updatedPackageFiles.concat(
    config.updatedLockFiles
  );
  if (updatedFiles && updatedFiles.length) {
    logger.debug(`${updatedFiles.length} file(s) to commit`);
    // Compile a few times in case there are nested dependencies
    let commitMessage = handlebars.compile(config.commitMessage)(config);
    commitMessage = handlebars.compile(commitMessage)(config);
    commitMessage = handlebars.compile(commitMessage)(config);
    if (config.toLowerCase) {
      const splitMessage = commitMessage.split('\n');
      splitMessage[0] = splitMessage[0].toLowerCase();
      commitMessage = splitMessage.join('\n');
    }
    if (config.commitBody) {
      commitMessage = `${commitMessage}\n\n${handlebars.compile(
        config.commitBody
      )(config)}`;
    }
    // API will know whether to create new branch or not
    await platform.commitFilesToBranch(
      config.branchName,
      updatedFiles,
      commitMessage,
      config.parentBranch || config.baseBranch || undefined,
      config.gitAuthor,
      config.gitPrivateKey
    );
  } else {
    logger.debug(`No files to commit`);
    return false;
  }
  return true;
}
