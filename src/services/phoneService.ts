import { supabase } from '../lib/supabase'
import { calculateScores } from '../utils/scoring'
import type { Phone } from '../types/phone'

export const phoneService = {
  // Barcha telefonlarni olish
  async getAll(): Promise<Phone[]> {
    const { data, error } = await supabase
      .from('phones')
      .select('*')
      .order('score_total', { ascending: false })
    if (error) throw error
    return data || []
  },

  // Bitta telefon
  async getById(id: string): Promise<Phone | null> {
    const { data, error } = await supabase
      .from('phones')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  // Qidirish
  async search(query: string): Promise<Phone[]> {
    const { data, error } = await supabase
      .from('phones')
      .select('*')
      .or(`brand.ilike.%${query}%,model.ilike.%${query}%`)
      .order('score_total', { ascending: false })
    if (error) throw error
    return data || []
  },

  // Filter
  async filter(filters: {
    brand?: string
    minPrice?: number
    maxPrice?: number
    minYear?: number
    os?: string
  }): Promise<Phone[]> {
    let query = supabase.from('phones').select('*')

    if (filters.brand) query = query.eq('brand', filters.brand)
    if (filters.minPrice) query = query.gte('price_usd', filters.minPrice)
    if (filters.maxPrice) query = query.lte('price_usd', filters.maxPrice)
    if (filters.minYear) query = query.gte('year', filters.minYear)
    if (filters.os) query = query.eq('os_name', filters.os)

    const { data, error } = await query.order('score_total', { ascending: false })
    if (error) throw error
    return data || []
  },

  // Qo'shish
  async create(phone: Omit<Phone, 'id' | 'created_at' | 'updated_at'>): Promise<Phone> {
    const scored = calculateScores(phone as Phone)
    const { data, error } = await supabase
      .from('phones')
      .insert([scored])
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Yangilash
  async update(id: string, phone: Partial<Phone>): Promise<Phone> {
    const scored = calculateScores(phone as Phone)
    const { data, error } = await supabase
      .from('phones')
      .update(scored)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // O'chirish
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('phones').delete().eq('id', id)
    if (error) throw error
  },

  // Taqqoslash tarixini saqlash
  async saveComparison(phone1Id: string, phone2Id: string, winnerId: string | null, score1: number, score2: number): Promise<void> {
    const { error } = await supabase.from('comparisons').insert([{
      phone1_id: phone1Id,
      phone2_id: phone2Id,
      winner_id: winnerId,
      phone1_score: score1,
      phone2_score: score2,
    }])
    if (error) throw error
  },
}
