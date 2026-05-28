-- Create a function to handle new user signups from Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public."User" (id, email, name, role, "isVerified", "createdAt", "updatedAt")
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'CampCart User'),
    'USER',
    coalesce((new.raw_user_meta_data->>'isVerified')::boolean, false),
    now(),
    now()
  );
  return new;
end;
$$;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Future Storage Buckets Documentation
-- These buckets need to be created in the Supabase Dashboard or via a separate storage schema migration.
-- 1. "avatars" - Public read, authenticated insert/update for own files
-- 2. "listing-images" - Public read, authenticated insert/update for own files
-- 3. "verification-ids" - Private read (Admins only), authenticated insert (Students submitting IDs)
