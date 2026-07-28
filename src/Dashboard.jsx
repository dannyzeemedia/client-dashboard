import { useEffect, useState } from 'react'
import { supabase } from './supa.js'
import ShareChart from './ShareChart.jsx'

const PILL = {
  won: ['pill won', 'Variant won'],
  control: ['pill held', 'Control held'],
  inconclusive: ['pill inc', 'Inconclusive'],
}

export default function Dashboard() {
  const [state, setState] = useState({ loading: true })

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('client_reports')
        .select('data, month, name')
        .order('month', { ascending: false })
        .limit(1)
      if (error) return setState({ loading: false, error: error.message })
      if (!data || !data.length) return setState({ loading: false, empty: true })
      setState({ loading: false, d: data[0].data })
    })()
  }, [])

  if (state.loading) return <div className="center muted">Loading your dashboard…</div>
  if (state.error) return <Shell><p className="muted">Couldn’t load: {state.error}</p></Shell>
  if (state.empty) return <Shell><p className="muted">No report is available for your account yet.</p></Shell>

  const d = state.d
  return (
    <div className="page" style={{ '--accent': d.accent }}>
      <div className="sheet">
        <header className="head">
          <div className="logo">{d.name}</div>
          <div className="meta">
            Klaviyo Performance Report<br />
            <b>{d.month_label}</b><br />
            Prepared by {d.agency} · figures in {d.currency}
            <button className="logout" onClick={() => supabase.auth.signOut()}>Log out</button>
          </div>
        </header>
        <div className="rule" />

        <h1 className="title">Flow performance, monthly review</h1>
        <p className="subtitle">{d.title_sub}</p>

        <div className="kpis">
          {d.kpis.map((k, i) => (
            <div key={i} className={'kpi' + (k.lead ? ' lead' : '')}>
              <div className="k-l">{k.label}</div>
              <div className="k-v">{k.value}</div>
              <div className="k-d">{k.delta}</div>
            </div>
          ))}
        </div>

        <h2>Flows’ share of store revenue, last 12 months</h2>
        <ShareChart months={d.chart.months} share={d.chart.share} baseline={d.chart.baseline}
                    baseLabel={d.chart.base_label} max={d.chart.max || 40} accent={d.accent} />
        <p className="caption">{d.chart.caption}</p>

        <h2>What changed this month</h2>
        <ul className="narr">
          {d.narrative.map((b, i) => (
            <li key={i}>
              {b.flag === 'win' && <span className="chip win">Win</span>}
              {b.flag === 'watch' && <span className="chip watch">Watch</span>}
              <span dangerouslySetInnerHTML={{ __html: b.html }} />
            </li>
          ))}
        </ul>

        <div className="statrow">
          <div className="stat hero">
            <div className="s-v">{d.stats.win_rate != null ? d.stats.win_rate + '%' : '—'}</div>
            <div className="s-l">Test win rate</div>
          </div>
          <div className="stat"><div className="s-v">{d.stats.concluded}</div><div className="s-l">Tests concluded</div></div>
          <div className="stat"><div className="s-v">{d.stats.won}</div><div className="s-l">Variants that won</div></div>
        </div>

        <div className="hb">
          <div className="hb-t">{d.heartbeat.title}</div>
          <div className="hb-b" dangerouslySetInnerHTML={{ __html: d.heartbeat.body_html }} />
        </div>

        <h2>Testing log</h2>
        <table className="log">
          <thead><tr><th>Flow / area</th><th>What we tested</th><th>Result</th></tr></thead>
          <tbody>
            {d.tests.map((t, i) => {
              const [cls, label] = PILL[t.result] || PILL.inconclusive
              return (
                <tr key={i}>
                  <td className="flow">{t.flow}</td>
                  <td>{t.what}</td>
                  <td><span className={cls}>{label}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <footer className="foot">
          <span>Klaviyo-attributed revenue. RPR = attributed revenue / emails delivered. Store revenue = all orders tracked in Klaviyo.</span>
          <span>{d.agency} · confidential</span>
        </footer>
      </div>
    </div>
  )
}

function Shell({ children }) {
  return (
    <div className="page">
      <div className="sheet">
        <header className="head">
          <div className="logo">Client Reporting</div>
          <div className="meta"><button className="logout" onClick={() => supabase.auth.signOut()}>Log out</button></div>
        </header>
        <div className="rule" />
        <div style={{ padding: '40px 0' }}>{children}</div>
      </div>
    </div>
  )
}
