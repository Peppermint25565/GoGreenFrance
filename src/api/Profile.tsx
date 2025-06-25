import { supabase } from '../supabase'
import type { ProfileInsert } from '../types/Profile'

export async function addProfile(payload: ProfileInsert) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getRole(email: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('email', email)
    .single()

  if (error) throw error
  return data['role']
}

export async function getAvatar(email: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('avatar')
    .eq('email', email)
    .single()

  if (error) throw error
  return data['avatar']
}

export async function getName(email: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('name')
    .eq('email', email)
    .single()

  if (error) throw error
  return data['name']
}