import { useState } from 'react'
import type { Language } from '../../utils/translations'
import { t } from '../../utils/translations'

const COUNTRY_CODES = ['+1', '+44', '+49', '+33', '+41', '+43', '+423', '+31', '+34', '+39', '+46', '+47', '+45', '+358', '+351', '+52', '+55', '+91', '+86', '+81']

const REVENUE_RANGES = [
  'Less than 10k', '10k - 50k', '50k - 100k',
  '100k - 250k', '250k - 500k', '500k - 1M', 'More than 1M'
]

export interface FormData {
  firstName: string
  lastName: string
  email: string
  countryCode: string
  phone: string
  revenueRange: string
  website: string
  businessDescription: string
  reason: string
}

interface BookingFormProps {
  language: Language
  onSubmit: (data: FormData) => void
  onBack: () => void
}

export function BookingForm({ language, onSubmit, onBack }: BookingFormProps) {
  const tr = t(language)
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', countryCode: '+423',
    phone: '', revenueRange: '', website: '', businessDescription: '', reason: '',
  })

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/70 placeholder-white/25 outline-none focus:border-white/30 transition-colors"

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSubmit(form) }}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-white/35 tracking-wider block mb-1">{tr.firstName} *</label>
          <input type="text" required value={form.firstName} onChange={set('firstName')}
            placeholder="John" className={inputClass} data-cursor="hover" />
        </div>
        <div>
          <label className="text-[10px] text-white/35 tracking-wider block mb-1">{tr.lastName}</label>
          <input type="text" value={form.lastName} onChange={set('lastName')}
            placeholder="Doe" className={inputClass} data-cursor="hover" />
        </div>
      </div>

      <div>
        <label className="text-[10px] text-white/35 tracking-wider block mb-1">{tr.email} *</label>
        <input type="email" required value={form.email} onChange={set('email')}
          placeholder="john@company.com" className={inputClass} data-cursor="hover" />
      </div>

      <div className="flex gap-2">
        <div className="w-24">
          <label className="text-[10px] text-white/35 tracking-wider block mb-1">Code</label>
          <select value={form.countryCode} onChange={set('countryCode')}
            className={inputClass} data-cursor="hover"
            style={{ background: '#0e0e1a' }}>
            {COUNTRY_CODES.map(c => <option key={c} value={c} style={{ background: '#0e0e1a' }}>{c}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-[10px] text-white/35 tracking-wider block mb-1">{tr.phone}</label>
          <input type="tel" value={form.phone} onChange={set('phone')}
            placeholder="123 456 7890" className={inputClass} data-cursor="hover" />
        </div>
      </div>

      <div>
        <label className="text-[10px] text-white/35 tracking-wider block mb-1">{tr.revenueRange} *</label>
        <select required value={form.revenueRange} onChange={set('revenueRange')}
          className={inputClass} data-cursor="hover"
          style={{ background: '#0e0e1a' }}>
          <option value="" style={{ background: '#0e0e1a' }}>{tr.selectRevenueRange}</option>
          {REVENUE_RANGES.map(r => <option key={r} value={r} style={{ background: '#0e0e1a' }}>{r}</option>)}
        </select>
      </div>

      <div>
        <label className="text-[10px] text-white/35 tracking-wider block mb-1">{tr.website} *</label>
        <input type="url" required value={form.website} onChange={set('website')}
          placeholder="https://yourcompany.com" className={inputClass} data-cursor="hover" />
      </div>

      <div>
        <label className="text-[10px] text-white/35 tracking-wider block mb-1">{tr.businessDescription} *</label>
        <textarea required rows={3} value={form.businessDescription} onChange={set('businessDescription')}
          placeholder={tr.businessDescriptionPlaceholder}
          className={`${inputClass} resize-none`} data-cursor="hover" />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" data-cursor="hover" onClick={onBack}
          className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/40 text-xs hover:text-white/60 hover:border-white/20 transition-all">
          {tr.back}
        </button>
        <button type="submit" data-cursor="hover"
          className="flex-1 py-2.5 rounded-xl bg-white/10 border border-white/25 text-white text-xs font-medium
                     hover:bg-white/15 hover:border-white/40 transition-all">
          {tr.submit} →
        </button>
      </div>
    </form>
  )
}
