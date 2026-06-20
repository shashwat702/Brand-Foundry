function AdminDashboard() {
  return (
    <main className="app-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Administration</span>
          <h1>Workspace overview</h1>
          <p>Monitor the essentials without losing sight of what matters.</p>
        </div>
        <span className="status-pill">System online</span>
      </div>

      <div className="admin-metrics">
        <article><span>Users</span><strong>—</strong><p>User reporting will appear here.</p></article>
        <article><span>Startups</span><strong>—</strong><p>Profile totals will appear here.</p></article>
        <article><span>Generations</span><strong>—</strong><p>Usage reporting will appear here.</p></article>
      </div>

      <section className="admin-panel">
        <div>
          <span className="eyebrow">Activity</span>
          <h2>Recent workspace events</h2>
        </div>
        <div className="empty-row">
          <span>No activity to show yet.</span>
          <small>New events will be listed here as the platform is used.</small>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
