
## v1.3.3

- Fixed JSON parsing for Groq response in the publishing workflow by handling empty content, checking the `reasoning` field, and extracting JSON objects from surrounding prose or markdown fences.


## v1.3.2

- Updated GitHub Actions publish workflow to set the remote URL using the DOCS_PAT token for authenticated pushes.


## v1.3.1

- Replaced urllib with curl in the GitHub Actions workflow to avoid Cloudflare 1010 blocks during Groq API calls.
- Removed the previous debug step that used urllib for testing the Groq response.

---
position: "3"
---
- 1.0.1
	- Fixed an issue where the passage from the `bible` command had an extra newline by default.
	- Removed `requirements.txt` from Git.
- 1.1.0
	- Added option to customize all of the bot's output through the new `output.toml` file, which has variables (e.g. `{{URL}}`) that you can place where e.g. the URL from the output should be placed inside the answer.
	- Added support for multiple different outputs through the `output.toml` file.
	- Moved the contents of the `success_messages.toml` files to the `output.toml` file and deleted all references to it from the code.
	- Fixed a bug where the arguments for the `currency` command were in the wrong order.
	- Fixed a bug where the changes of the money balance weren't saved in the `money.toml` file.
	- Fixed a bug where the `bitcoin` command couldn't be called because it wasn't in the `process.py` script.
	- Added better error handling to the `calculate` and `image` commands.
	- Added a default shrug ASCII emoji (¯\\_(ツ)_/¯) to the `ascii_art` variable inside of the `config.toml file`.
- 1.0.2
	- Fixed a typo in the templates file (`commmand_prefix` instead of `command_prefix`) which caused an error on startup.
- 1.0.1
	- Fixed an error where the imported scripts couldn't be found due to change in the project structure.
- 1.0.0
	- Initial release.