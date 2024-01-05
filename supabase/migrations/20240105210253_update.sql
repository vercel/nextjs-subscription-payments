drop policy "Can update own user data." on "public"."users";

drop policy "Can view own user data." on "public"."users";

alter table "public"."customers" drop constraint "customers_id_fkey";

alter table "public"."subscriptions" drop constraint "subscriptions_user_id_fkey";

alter table "public"."users" drop constraint "users_id_fkey";

alter table "public"."prices" drop column "description";

alter table "public"."prices" drop column "metadata";

alter table "public"."customers" add constraint "customers_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."customers" validate constraint "customers_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

create policy "Enable delete access for customers based on id"
on "public"."customers"
as permissive
for delete
to authenticated
using ((auth.uid() = id));


create policy "Enable insert for customers based on id"
on "public"."customers"
as permissive
for insert
to authenticated
with check ((auth.uid() = id));


create policy "Enable read access for customers based on id"
on "public"."customers"
as permissive
for select
to authenticated
using ((auth.uid() = id));


create policy "Enable update access for customers based on id"
on "public"."customers"
as permissive
for update
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));


create policy "Enable delete access for subscriptions based on user_id"
on "public"."subscriptions"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "Enable insert for subscriptions based on user_id"
on "public"."subscriptions"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Enable read access for subscriptions based on user_id"
on "public"."subscriptions"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable update access for subscriptions based on user_id"
on "public"."subscriptions"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Enable delete access for users based on id"
on "public"."users"
as permissive
for delete
to authenticated
using ((auth.uid() = id));


create policy "Enable insert for users based on id"
on "public"."users"
as permissive
for insert
to authenticated
with check ((auth.uid() = id));


create policy "Enable read access for users based on id"
on "public"."users"
as permissive
for select
to authenticated
using ((auth.uid() = id));


create policy "Enable update access for users based on id"
on "public"."users"
as permissive
for update
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));




