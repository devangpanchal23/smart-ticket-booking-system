# SmartTicket

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

## Configuration & secrets 🔒

This repository no longer commits any API keys or service credentials. Personal values live in `.env` (ignored) or your local `environment.ts` file.

1. **Copy the sample**
   ```bash
   cp src/environments/environment.sample.ts src/environments/environment.ts
   ```
2. **Fill in the placeholders** with the corresponding values from your `.env` or provider dashboard.
3. **Do not commit** `src/environments/environment.ts` or `.env` – they are already listed in `.gitignore`.

If you accidentally committed sensitive data earlier, remove it with:

```bash
git rm --cached src/environments/environment.ts
```

and force‑push the cleaned history if necessary.

This change keeps your codebase safe and prevents rule‑violation errors when pushing.
