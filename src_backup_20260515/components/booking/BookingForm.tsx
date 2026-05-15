import { useState } from 'react'
import type { Language } from '../../utils/translations'
import { t } from '../../utils/translations'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[\d\s\-().+]{5,20}$/
const URL_RE = /^https?:\/\/.+\..+/
const SAFE_TEXT_RE = /<[^>]*>|javascript:|data:/gi

function sanitizeText(val: string): string {
  return val.replace(SAFE_TEXT_RE, '')
}

function validateForm(form: FormData): string | null {
  if (!form.firstName.trim()) return 'First name is required.'
  if (!EMAIL_RE.test(form.email)) return 'Please enter a valid email address.'
  if (form.phone && !PHONE_RE.test(form.phone)) return 'Please enter a valid phone number.'
  if (!URL_RE.test(form.website)) return 'Please enter a valid website URL starting with https://.'
  if (form.businessDescription.trim().length < 10) return 'Please describe your business (min 10 characters).'
  if (!form.revenueRange) return 'Please select a revenue range.'
  return null
}

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
  const [validationError, setValidationError] = useState<string | null>(null)

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const raw = e.target.value
    const sanitized = ['businessDescription', 'reason', 'firstName', 'lastName'].includes(key)
      ? sanitizeText(raw)
      : raw
    setForm(prev => ({ ...prev, [key]: sanitized }))
    setValidationError(null)
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/70 placeholder-white/25 outline-none focus:border-white/30 transition-colors"

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        const err = validateForm(form)
        if (err) { setValidationError(err); return }
        onSubmit(form)
      }}
      className="flex flex-col gap-4"
    >
      {validationError && (
        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {validationError}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-white/35 tracking-wider block mb-1">{tr.firstName} *</label>
          <input type="text" required value={form.firstName} onChange={set('firstName')}
            placeholder="John" className={inputClass} />
        </div>
        <div>
          <label className="text-[10px] text-white/35 tracking-wider block mb-1">{tr.lastName}</label>
          <input type="text" value={form.lastName} onChange={set('lastName')}
            placeholder="Doe" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="text-[10px] text-white/35 tracking-wider block mb-1">{tr.email} *</label>
        <input type="email" required value={form.email} onChange={set('email')}
          placeholder="john@company.com" className={inputClass} />
      </div>

      <div className="flex gap-2">
        <div className="w-24">
          <label className="text-[10px] text-white/35 tracking-wider block mb-1">Code</label>
          <select value={form.countryCode} onChange={set('countryCode')}
            className={inputClass}
            style={{ background: '#0e0e1a' }}>
            {COUNTRY_CODES.map(c => <option key={c} value={c} style={{ background: '#0e0e1a' }}>{c}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-[10px] text-white/35 tracking-wider block mb-1">{tr.phone}</label>
          <input type="tel" value={form.phone} onChange={set('phone')}
            placeholder="123 456 7890" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="text-[10px] text-white/35 tracking-wider block mb-1">{tr.revenueRange} *</label>
        <select required value={form.revenueRange} onChange={set('revenueRange')}
          className={inputClass}
          style={{ background: '#0e0e1a' }}>
          <option value="" style={{ background: '#0e0e1a' }}>{tr.selectRevenueRange}</option>
          {REVENUE_RANGES.map(r => <option key={r} value={r} style={{ background: '#0e0e1a' }}>{r}</option>)}
        </select>
      </div>

      <div>
        <label className="text-[10px] text-white/35 tracking-wider block mb-1">{tr.website} *</label>
        <input type="url" required value={form.website} onChange={set('website')}
          placeholder="https://yourcompany.com" className={inputClass} />
      </div>

      <div>
        <label className="text-[10px] text-white/35 tracking-wider block mb-1">{tr.businessDescription} *</label>
        <textarea required rows={3} value={form.businessDescription} onChange={set('businessDescription')}
          placeholder={tr.businessDescriptionPlaceholder}
          className={`${inputClass} resize-none`} />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack}
          className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/40 text-xs hover:text-white/60 hover:border-white/20 transition-all">
          {tr.back}
        </button>
        <button type="submit"
          className="flex-1 py-2.5 rounded-xl bg-white/10 border border-white/25 text-white text-xs font-medium
                     hover:bg-white/15 hover:border-white/40 transition-all">
          {tr.submit} →
        </button>
      </div>
    </form>
  )
}
