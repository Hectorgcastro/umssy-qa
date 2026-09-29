branch="$1"
GROUP='^(feature|fix|hotfix|refactor|docs|test)/grupo-[0-9]+-[a-z0-9]+(-[a-z0-9]+)*$'
DEVOPS='^(chore|ci|feature|fix|hotfix|refactor|docs|test)/devops-[a-z0-9]+(-[a-z0-9]+)*$'
EPIC='^epic/grupo-?[0-9]+-[a-z0-9]+(-[a-z0-9]+)*$'
[[ "$branch" == "dev" || "$branch" == "main" || "$branch" =~ $GROUP || "$branch" =~ $DEVOPS || "$branch" =~ $EPIC ]] && exit 0
echo "Nombre de rama inválido: $branch" >&2
echo "Grupos: <tipo>/grupo-<n>-<descripcion>. DevOps: <tipo>/devops-<descripcion>. chore y ci son solo de DevOps." >&2
exit 1