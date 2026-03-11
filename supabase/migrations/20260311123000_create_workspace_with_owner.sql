create or replace function public.create_workspace_with_owner(
  workspace_name text,
  workspace_slug text
)
returns public.workspaces
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid := auth.uid();
  new_workspace public.workspaces;
begin
  if actor_id is null then
    raise exception 'Authentication required';
  end if;

  insert into public.workspaces (name, slug, created_by)
  values (workspace_name, workspace_slug, actor_id)
  returning * into new_workspace;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (new_workspace.id, actor_id, 'owner')
  on conflict (workspace_id, user_id) do update
    set role = excluded.role;

  return new_workspace;
end;
$$;

grant execute on function public.create_workspace_with_owner(text, text) to authenticated;
