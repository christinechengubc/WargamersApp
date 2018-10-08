# WargamersApp
An online GUI for the Wargamers club to manage and view their games, events and club information.

Using the Script:
1. Open cmd prompt
2. psql -U USERNAME
2a. Enter Password
3. Create database DATABASENAME
4. Quit
5. psql -U USERNAME DATABASENAME < Script.pgsql
5a. enter password

Example: psql -U postgres mydb < Script.pgsql

You can find the script inside of the API/bin folder.

## package_lock.json

**What is package_lock.json?**
First, in order to understand why `package_lock.json` is needed, we need to understand what exactly `package.json` is. To put it simply, `package.json` is a file that describes the modules (code that other people have written to be re-used) that your project depends on, also known as "dependencies".

We need this file to understand which modules we should install, and which versions of them we should install, in order for our project to run. And we can install them by running `npm install`.

The way that `package.json` denotes the versions of the modules is done using something called "semantic versioning", a standard used to let people know what kind of changes have been made. It looks something like this: `version: "x.x.x"`.

* Incrementing the first number represents major changes, ones that would break backward compatability.
* Incrementing the second number represents new features that don't break existing features.
* Incrementing the third number represents bug fixes, and other minor changes.

Now, it's important to note that `package.json` doesn't always specify which EXACT version of the module we need to install. Sometimes it specifies ranges: for example, `"bar" : ">=1.0.2 <2.1.2"` means: install a version of "bar" that is greater than or equal to 1.0.2, but less than 2.1.2.

Another example: `"foo" : "^1.0.0"`means install a version of "foo" that is compatible with 1.0.0.
One more example: `"baz" : "~1.0.2"` means install a version of "baz" that is approximately the same version as 1.0.2.

This is important to note because what this means is that running `npm install` is NOT guaranteed to get you the same versions of the modules that someone else is using.

For example: let's say I have `"foo" : "^1.0.0"` specified in `package.json`.
*User A* could run `npm install`, and get version 1.0.0.
2 weeks later, a new minor change for "foo" is released, leading to version 1.1.0, which is still compatible with 1.0.0.
*User B* then runs `npm install`, getting version 1.1.0.

This could possibly be bad, because that minor change could potentially break the project that you are currently working on. For that reason, it's important to note the EXACT versions that a user is using in order to be able to perfectly reproduce their build. That way, you can get guaranteed running builds - and understand exactly which versions work, and which versions don't.

That's precisely what `package_lock.json` is for. Like `package.json`, it is a file that describes the dependencies for your project - but lists the EXACT version that was used during that time. By committing `package_lock.json` every time, we can see which dependencies were used for which commits.

**How do I avoid causing a merge conflict with package_lock.json?**

Ideally, all members working on the project should have the same `package_lock.json`, unless there is some module that needs to be installed in order for something to work, in which case, it must be modified.

The best way to ensure that everyone is working with the same `package_lock.json` is to frequently run `git pull`, and if you run into a merge conflict with `package_lock.json`, run `git checkout --theirs API/package_lock.json` (or `client/package_lock.json`, depending on which one.) After obtaining the new remote `package_lock.json`, run `npm ci` to make sure that the node modules you are using are the ones described by `package_lock.json`, and not your own local versions.

If you do find that you need to install a new version of a module, you can do this to include new versions of modules that you've installed in your own package_lock.json:

"As of `npm@5.7.0`, conflicts can be fixed by manually fixing any `package.json` conflicts, and then running `npm install [--package-lock-only]` again. npm automatically resolves conflicts and writes a merged package_lock.json for which you can then commit."

**Is there any real benefit to doing this?**

To be honest, I'm not really sure. I do think it's a good idea to try and experiment and get familiar with both `git` and `package_lock.json` for the future, so I think it's worth trying for a little while, at least until it gets too cumbersome.
