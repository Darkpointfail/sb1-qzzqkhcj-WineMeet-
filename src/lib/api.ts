import { supabase } from './supabase';
import type { Meeting, Product, SalesRep, Promotion } from '../types';

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function getSalesReps(): Promise<SalesRep[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function getMeetings(): Promise<Meeting[]> {
  const { data, error } = await supabase
    .from('meetings')
    .select(`
      *,
      sales_rep:profiles(*),
      products:meeting_products(product:products(*))
    `)
    .order('date');
  
  if (error) throw error;
  return data.map(meeting => ({
    ...meeting,
    products: meeting.products.map(p => p.product.id)
  }));
}

export async function getPromotions(): Promise<Promotion[]> {
  const { data, error } = await supabase
    .from('promotions')
    .select(`
      *,
      product:products(*)
    `)
    .order('start_date');
  
  if (error) throw error;
  return data;
}

export async function createMeeting(meeting: Omit<Meeting, 'id'>) {
  const { data, error } = await supabase
    .from('meetings')
    .insert([{
      title: meeting.title,
      date: meeting.date,
      sales_rep_id: meeting.salesRepId,
      notes: meeting.notes
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  if (meeting.products.length > 0) {
    const { error: productsError } = await supabase
      .from('meeting_products')
      .insert(
        meeting.products.map(productId => ({
          meeting_id: data.id,
          product_id: productId
        }))
      );
    
    if (productsError) throw productsError;
  }
  
  return data;
}

export async function updateMeeting(id: string, meeting: Partial<Meeting>) {
  const { error } = await supabase
    .from('meetings')
    .update({
      title: meeting.title,
      date: meeting.date,
      sales_rep_id: meeting.salesRepId,
      notes: meeting.notes
    })
    .eq('id', id);
  
  if (error) throw error;
  
  if (meeting.products) {
    // Delete existing products
    await supabase
      .from('meeting_products')
      .delete()
      .eq('meeting_id', id);
    
    // Insert new products
    const { error: productsError } = await supabase
      .from('meeting_products')
      .insert(
        meeting.products.map(productId => ({
          meeting_id: id,
          product_id: productId
        }))
      );
    
    if (productsError) throw productsError;
  }
}