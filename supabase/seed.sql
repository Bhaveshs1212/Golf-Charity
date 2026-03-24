insert into public.charities (name, description)
values
  ('Coastal Water Relief', 'Clean water access and infrastructure support.'),
  ('Youth Sports Fund', 'Community youth sports scholarships.'),
  ('Green City Trees', 'Urban tree planting and maintenance.'),
  ('STEM Futures', 'STEM education grants.'),
  ('Community Wellness', 'Local wellness initiatives.'),
  ('Food Rescue Network', 'Food recovery and distribution.');

update public.users
set role = 'admin'
where email = 'admin@golfcharity.com';
