# Preparation

```shell
curl --location https://raw.githubusercontent.com/github/gitignore/refs/heads/main/Node.gitignore --output .gitignore
```

# X API Functions

A project to fetch X (Twitter) trends, ready for deployment to Cloud Functions
for Firebase.

## Preparation

1. Create a `.env` file based on `.env.example`.
2. Add your `BEARER_TOKEN` from the X Developer Portal.

## How it Works

The script uses the `client.trends.getByWoeid(woeid)` method from the
[X SDK for TypeScript](https://github.com/xdevplatform/xdk-typescript).

## Local Development

You can run the functions locally using the Firebase Emulator Suite:

```shell
npm run build
npm run serve
```

The function will be available at
`http://127.0.0.1:5001/<your-project-id>/<region>/getTrends`.

## Deployment to Firebase

1. Install Firebase CLI if you haven't: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize your project (if not already): `firebase use --add`
4. Deploy the functions:
   ```shell
   npm run deploy
   ```

**Note:** You must configure the environment variables in the Firebase Console
or using secrets for production.

## References

- https://docs.x.com
- https://github.com/xdevplatform/samples/tree/main/javascript
- [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions)
