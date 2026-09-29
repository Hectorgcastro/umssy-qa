const isDevops = process.env.COMMIT_PROFILE === "devops";

const baseTypes = ["docs", "feat", "fix", "perf", "refactor", "test", "build"];
const devopsTypes = [...baseTypes, "ci", "chore"];

export default {
  rules: {
    "type-empty": [2, "never"],
    "type-case": [2, "always", "lower-case"],
    "type-enum": [2, "always", isDevops ? devopsTypes : baseTypes],

    "scope-case": [2, "always", "lower-case"],
    "scope-enum": [2, "always", ["frontend", "backend", "database"]],

    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100],
  },
};
