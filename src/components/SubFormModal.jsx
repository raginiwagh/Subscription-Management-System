import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE } from '../config'

export default function SubFormModal({ onClose, onSaved, edit }) {
  const [form, setForm] = useState({
    user_email:'', plan_name:'', start_date:'', end_date:'', monthly_cost:0, status:'Active'
  })
  useEffect(()=>{ if(edit) setForm(edit) }, [edit])

  function change(e){ const {name,value} = e.target; setForm(f=>({...f,[name]:value})) }

  async function save(e){
    e.preventDefault()
    // Basic validation
    if(!form.user_email.includes('@')) return alert('Enter valid email')
    if(!form.plan_name) return alert('Plan required')
    if(!form.start_date || !form.end_date) return alert('Start and end required')
    if(new Date(form.end_date) < new Date(form.start_date)) return alert('End must be >= start')
    if(Number(form.monthly_cost) < 0) return alert('Cost must be >= 0')
    try {
      if(edit) {
        await axios.put(API_BASE + '/subscriptions/' + edit.subscription_id, form)
      } else {
        await axios.post(API_BASE + '/subscriptions', form)
      }
      onSaved()
      alert('Saved')
    } catch(err) {
      alert('Save failed: ' + err.message)
    }
  }

  return (
    <div className="modal">
      <div className="modal-box">
        <h3>{edit ? 'Edit' : 'Add New'} Subscription</h3>
        <form onSubmit={save}>
          <div className="form-row">
            <label>Email</label>
            <input name="user_email" value={form.user_email} onChange={change} type="text" />
          </div>
          <div className="form-row">
            <label>Plan Name</label>
            <input name="plan_name" value={form.plan_name} onChange={change} type="text" />
          </div>
          <div className="form-row">
            <label>Start Date</label>
            <input name="start_date" value={form.start_date} onChange={change} type="date" />
          </div>
          <div className="form-row">
            <label>End Date</label>
            <input name="end_date" value={form.end_date} onChange={change} type="date" />
          </div>
          <div className="form-row">
            <label>Monthly Cost</label>
            <input name="monthly_cost" value={form.monthly_cost} onChange={change} type="number" step="0.01" />
          </div>
          <div className="form-row">
            <label>Status</label>
            <select name="status" value={form.status} onChange={change}>
              <option>Active</option>
              <option>Expired</option>
              <option>Cancelled</option>
            </select>
          </div>
          <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
