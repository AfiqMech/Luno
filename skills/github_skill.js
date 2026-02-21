const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

// --- GitHub Skill ---
// Usage:
//   node github_skill.js create-repo <repo-name> [description]
//   node github_skill.js push <local-dir> <owner/repo> [commit-message]
//   node github_skill.js list-repos

async function getClient() {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        console.error('❌ GITHUB_TOKEN is missing. Run: antigravity memory set GITHUB_TOKEN "ghp_..."');
        process.exit(1);
    }
    return new Octokit({ auth: token });
}

async function getAuthUser(octokit) {
    const { data } = await octokit.rest.users.getAuthenticated();
    return data.login;
}

// --- Create a new GitHub repo ---
async function createRepo(repoName, description = 'Created by Antigravity') {
    const octokit = await getClient();
    console.log(`📦 Creating GitHub repo: ${repoName}...`);
    const { data } = await octokit.rest.repos.createForAuthenticatedUser({
        name: repoName,
        description,
        private: false,
        auto_init: true,
    });
    console.log(`✅ Repo created: ${data.html_url}`);
    return data;
}

// --- Push all files from a local directory to a GitHub repo ---
async function pushDirectory(localDir, repoFullName, commitMessage = 'feat: Antigravity auto-commit') {
    const octokit = await getClient();
    const [owner, repo] = repoFullName.includes('/') ? repoFullName.split('/') : [await getAuthUser(octokit), repoFullName];

    console.log(`🚀 Pushing "${localDir}" → ${owner}/${repo}...`);

    // Get all files recursively
    const getAllFiles = (dir, base = dir) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        let files = [];
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            // Skip node_modules, .git, .vercel
            if (['node_modules', '.git', '.vercel', 'qa_result_1771666745623.png'].includes(entry.name)) continue;
            if (entry.isDirectory()) {
                files = files.concat(getAllFiles(fullPath, base));
            } else {
                files.push({ fullPath, relativePath: path.relative(base, fullPath).replace(/\\/g, '/') });
            }
        }
        return files;
    };

    const files = getAllFiles(localDir);
    console.log(`📁 Found ${files.length} files to push...`);

    // Get current commit SHA for the default branch
    let latestCommitSha, treeSha;
    try {
        const { data: ref } = await octokit.rest.git.getRef({ owner, repo, ref: 'heads/main' });
        latestCommitSha = ref.object.sha;
        const { data: commit } = await octokit.rest.git.getCommit({ owner, repo, commit_sha: latestCommitSha });
        treeSha = commit.tree.sha;
    } catch (e) {
        console.error(`❌ Could not find repo "${owner}/${repo}". Make sure it exists first.`);
        console.error('   Run: antigravity github create-repo <name>');
        process.exit(1);
    }

    // Create blobs for each file
    const treeItems = [];
    for (const { fullPath, relativePath } of files) {
        process.stdout.write(`  📄 Uploading: ${relativePath}...`);
        const content = fs.readFileSync(fullPath);
        const isBinary = content.includes('\0');
        const { data: blob } = await octokit.rest.git.createBlob({
            owner, repo,
            content: isBinary ? content.toString('base64') : content.toString('utf-8'),
            encoding: isBinary ? 'base64' : 'utf-8',
        });
        treeItems.push({ path: relativePath, mode: '100644', type: 'blob', sha: blob.sha });
        process.stdout.write(' ✅\n');
    }

    // Create tree, commit, and update ref
    const { data: newTree } = await octokit.rest.git.createTree({ owner, repo, base_tree: treeSha, tree: treeItems });
    const { data: newCommit } = await octokit.rest.git.createCommit({
        owner, repo, message: commitMessage,
        tree: newTree.sha, parents: [latestCommitSha],
    });
    await octokit.rest.git.updateRef({ owner, repo, ref: 'heads/main', sha: newCommit.sha });

    console.log(`\n🎉 Successfully pushed ${files.length} files!`);
    console.log(`🔗 View at: https://github.com/${owner}/${repo}`);
    console.log(`[[ANTIGRAVITY_GITHUB_PUSHED]]: https://github.com/${owner}/${repo}`);
}

// --- List repos ---
async function listRepos() {
    const octokit = await getClient();
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({ sort: 'updated', per_page: 10 });
    console.log('📋 Your 10 most recent GitHub repos:');
    data.forEach(r => console.log(`  - ${r.full_name} → ${r.html_url}`));
}

// --- Delete a repo ---
async function deleteRepo(repoFullName) {
    const octokit = await getClient();
    const owner = repoFullName.includes('/') ? repoFullName.split('/')[0] : await getAuthUser(octokit);
    const repo = repoFullName.includes('/') ? repoFullName.split('/')[1] : repoFullName;
    console.log(`🗑️ Deleting repo: ${owner}/${repo}...`);
    await octokit.rest.repos.delete({ owner, repo });
    console.log(`✅ Repo deleted: ${owner}/${repo}`);
}

// --- Main ---
async function main() {
    const command = process.argv[2];
    const arg1 = process.argv[3];
    const arg2 = process.argv[4];
    const arg3 = process.argv[5];

    try {
        if (command === 'create-repo') {
            await createRepo(arg1, arg2);
        } else if (command === 'push') {
            await pushDirectory(arg1, arg2, arg3);
        } else if (command === 'list-repos') {
            await listRepos();
        } else if (command === 'delete-repo') {
            await deleteRepo(arg1);
        } else {
            console.log('Usage:');
            console.log('  node github_skill.js create-repo <name> [description]');
            console.log('  node github_skill.js push <local-dir> <owner/repo> [message]');
            console.log('  node github_skill.js list-repos');
            console.log('  node github_skill.js delete-repo <owner/repo>');
        }
    } catch (err) {
        console.error('❌ GitHub skill error:', err.message || err);
        process.exit(1);
    }
}

main();
