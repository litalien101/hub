export default function ActivityTimeline({ activity }: any) {
  if (!activity?.length) {
    return (
      <div className="mt-6 text-sm text-gray-500">
        No activity yet.
      </div>
    );
  }

  return (
    <section className="mt-6">
      <h3 className="mb-2 text-sm font-semibold">Activity</h3>

      <ul className="space-y-3">
        {activity.map((a: any) => (
          <li
            key={a.id}
            className="rounded border px-3 py-2 text-xs"
          >
            <div className="font-medium text-gray-800">
              {a.action.replaceAll("_", " ")}
            </div>
            <div className="text-gray-500">
              {new Date(a.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
