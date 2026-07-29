export default function UserSearchItem({
user,
onClick,
}) {
const displayName =
user.fullName ||
user.username ||
"Unknown user";

const initial =
displayName
.charAt(0)
.toUpperCase();

return ( <button
   type="button"
   onClick={onClick}
   className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-ink-800"
 > <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-signal text-sm font-semibold text-white">
{initial} </div>

```
  <div className="min-w-0 flex-1">
    <p className="truncate text-sm font-medium text-mist-50">
      {displayName}
    </p>

    <p className="truncate text-xs text-mist-300">
      @{user.username}
    </p>
  </div>

  {user.online && (
    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
  )}
</button>

);
}
