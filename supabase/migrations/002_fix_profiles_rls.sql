-- Migration 002: Fix profiles UPDATE policy to prevent role self-escalation
-- Users were able to set their own role to 'vendor' or 'admin' via a direct
-- Supabase client update. This migration adds a WITH CHECK clause that locks
-- the role column to its existing value on user-initiated updates.

-- Drop the permissive update policy from migration 001
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Re-create with a WITH CHECK that prevents the role column from being changed.
-- Only the service role (admin operations) can change roles.
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );
