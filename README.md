# KOTOR Community Portal Website
This repository contains the build system for the KOTOR Community Portal website which is located at https://kotor.neocities.org/. This document will go over the process for building the website and deploying to Neocities, including how to preview the website on your local machine.

The toolchain has only been built for Windows at this time.

## Setup
1. Download a copy of this repository ([website](https://github.com/KOTOR-Community-Portal/website)), and any repositories with content you will be working with (e.g. [website-content](https://github.com/KOTOR-Community-Portal/website-content)).
   - It is recommended that you [clone a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) with [GitHub Desktop](https://desktop.github.com/download/) or a similar tool, as that will allow you to sync with changes made to the repository and commit changes yourself. You can also download the repository as a `.zip` archive, then extract the contents; however, you would need to do this again whenever a repository is changed in order to stay up to date with its content.
   - Make sure to pull changes with Git or download a fresh copy of the repository whenever someone makes changes.
   - Each repository needs to be saved to its own folder with the same name as the repository, and the repository folders need to be placed in the same location on your local machine. 
   - You do not need to download all of the content from all of the repositories. The build toolchain will log errors for any missing pages and you will not be able to view those pages, but you will be able to view the pages for the content you downloaded. [website-content](https://github.com/KOTOR-Community-Portal/website-content) must be included in order for the website's homepage and other critical pages to be built.
3. In your `website` folder, create a folder named `bin`.
   - This folder is not tracked on GitHub. Anything you place here will not be committed to the `website` repository, so you will have to manage the contents of this folder yourself.
4. Get [the latest release of our Static HTML Generator](https://github.com/KOTOR-Community-Portal/static-html-generator/releases/latest). Download the file `StaticHtmlGenerator.exe` and place the file in `website/bin`.
   - Make sure to repeat this step whenever a new version of the Static HTML Generator is released, replacing the old version of `StaticHtmlGenerator.exe`.
5. Get [the latest release of our Local Web Server](https://github.com/KOTOR-Community-Portal/local-web-server/releases/latest). Download the file `LocalWebServer.exe` and place it in `website/bin`.
   - Make sure to repeat this step whenever a new version of the Local Web Server is released, replacing the old version of `LocalWebServer.exe`.

If I wanted to work with the content for `mod-builds`, `news`, and `website-content`, the directory on my local machine would look something like the diagram below.

```
mod-builds/
├─ ...
news/
├─ ...
website/
├─ bin/
│  ├─ LocalWebServer.exe
│  ├─ StaticHtmlGenerator.exe
├─ build.bat
├─ manifest.xml
├─ serve.bat
├─ ...
website-content/
├─ ...
```

## Build
You can build a copy of the website on your local machine by running the `build.bat`script, which launches the Static HTML Generator with the correct configuration.

Roughly, this is how the Static HTML Generator works:
1. A manifest file, `manifest.xml`, lists all of the pages to be built.
2. For each page, content is converted from Markdown to HTML based on templates specified in the manifest.
3. Generated HTML pages are saved to the `build` folder.
4. All files in the `public` folder are copied to the `build` folder.

You will need to run `build.bat` again whenever you make or pull changes to the website content.

## Preview
You can preview the website on your local machine by running the `serve.bat` script, which launches the Local Web Server with the correct configuration.

Normally, when you visit a website, you are requesting that the machine at that address serve webpages to your browser. localhost is a special address which represents your own machine. Our Local Web Server mimics the behavior of Neocities' web server, but serves pages from localhost, so the files are read from your own machine. This makes it possible to to edit the website on your local machine and preview the changes before deploying them to Neocities.

After running `serve.bat`, ctrl+click on the link in the console to view the website in your browser or go to http://localhost:8000/. This replaces the https://kotor.neocities.org/ part of a URL while the website is being hosted on your local macine. Note that the port number may be different for you.

You can keep the server running while you are making changes; you don't need to restart it. You may need to clear your browser's cache to view your changes, however.

## Contribute
When you have finished making changes on your local machine, you will need to commit them to the repository so everyone else can see them. See our [Contributing Guide](https://github.com/KOTOR-Community-Portal/website-content/blob/-/CONTRIBUTING.md#making-changes) for how to make changes.

You may also want to check our [Writing Guide](https://github.com/KOTOR-Community-Portal/website-content/blob/-/WRITING.md) for information about the Markdown format and best practices.

## Deploy
This repository contains a workflow which automatically builds and deploys the website whenever changes are made to the `main` branch. The workflow can also be run manually by contributors to this repository.

1. Go to the [Deploy to Neocities workflow](https://github.com/KOTOR-Community-Portal/website/actions/workflows/deploy-to-neocities.yml).
   - You can get to this workflow from anywhere in the `website` repository by going to the `Actions` tab, then selecting the `Deploy to Neocities` workflow from the sidebar.
2. Click the `Run workflow` button.
3. This will open a popover menu with two options. You most likely will want to keep the defaults, but here is what these options do:
   - `Use workflow from`: This lets you choose which branch of the repository the workflow will run on.
   - `cleanup`: Enabling this option will delete files which exist on Neocities but are not included in the build. Neocities does not provide any way to recover deleted files.
4. Click the `Run workflow` button and wait for the workflow to finish running.

Roughly, this is what the workflow does:
1. Download the contents of all website repositories.
2. Download, build, and run the Static HTML Generator.
3. Deploy the built website to Neocities.

Step 1 needs to be updated if the repository structure changes, such as if repositories for new types of content are created.

The Static HTML Generator used in Step 2 is a .NET application. Code is checked out from the `main` branch of the [static-html-generator](https://github.com/KOTOR-Community-Portal/static-html-generator) repository. This step builds the code from source and does __not__ download a release. This step should not fail unless a breaking change is made to the associated repository or there is some unforeseeable .NET issue.

A third-party workflow, [Deploy to Neocities](https://github.com/bcomnes/deploy-to-neocities), is used in Step 3. This step could potentially go wrong for reasons beyond our control if that workflow has an issue. Our workflow might also fail if Neocities is down or if Neocities rate limits our requests.

The request to deploy Neocities requires an API key which is stored as a secret on this repository. The value of a secret is not visible on GitHub, so only someone with access to the `kotor.neocities.org` account can see what it is. This account can also generate a new API key, invalidating the old one. In such an event, the GitHub secret `NEOCITIES_API_KEY` will need to be updated for the workflow to be able to run successfully.

GitHub generates extensive logs which may help in the event that something goes wrong and the problem is not one of the ones mentioned above.
