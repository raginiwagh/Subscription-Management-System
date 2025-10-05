import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE } from './config'
import SubFormModal from './components/SubFormModal'

function calcRemainingDays(endDateStr) {
  const today = new Date()
  const end = new Date(endDateStr + 'T00:00:00')
  const diff = Math.ceil((end - today) / (1000*60*60*24))
  return diff
}

export default function App() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [editSub, setEditSub] = useState(null)

  async function fetchSubs() {
    setLoading(true)
    try {
      const res = await axios.get(API_BASE + '/subscriptions')
      setSubs(res.data)
    } catch (err) {
      alert('Error fetching subscriptions: ' + err.message)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchSubs() }, [])

  async function handleDelete(id) {
    if (!confirm('Delete subscription?')) return
    try {
      await axios.delete(API_BASE + '/subscriptions/' + id)
      fetchSubs()
      alert('Deleted')
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  return (
    <div className="container">
      <h1>Subscription Management System</h1>
      <div style={{display:'flex', gap:10, marginBottom:12}}>
        <button onClick={()=>setShowAdd(true)}>Add New</button>
        <button onClick={fetchSubs}>Refresh</button>
      </div>
      {loading ? <div>Loading...</div> : (
        <table className="subs-table">
          <thead><tr>
            <th>ID</th><th>Email</th><th>Plan</th><th>Start</th><th>End</th><th>Remaining Days</th><th>Cost</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {subs.map(s => {
              const remaining = calcRemainingDays(s.end_date)
              const visualStatus = remaining < 0 ? 'Expired' : s.status
              return (
                <tr key={s.subscription_id}>
                  <td>{s.subscription_id}</td>
                  <td>{s.user_email}</td>
                  <td>{s.plan_name}</td>
                  <td>{s.start_date}</td>
                  <td>{s.end_date}</td>
                  <td>{remaining}</td>
                  <td>{s.monthly_cost}</td>
                  <td>{visualStatus}</td>
                  <td>
                    <button onClick={()=>{ setEditSub(s); setShowAdd(true); }}>Edit</button>
                    <button onClick={()=>handleDelete(s.subscription_id)}>Delete</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      {showAdd && <SubFormModal
        onClose={()=>{ setShowAdd(false); setEditSub(null); }}
        onSaved={()=>{ setShowAdd(false); setEditSub(null); fetchSubs(); }}
        edit={editSub}
      />}
    </div>
  )
}
