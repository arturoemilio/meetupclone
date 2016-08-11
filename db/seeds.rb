# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
users = User.create([
  { username: "pikachu", email: "pik@chu.com", password: "whatever" },
  { username: "charmander", email: "char@mander.com", password: "whatever" },
  { username: "porygon", email: "pory@gon.com", password: "whatever" },
  { username: "abra", email: "ab@ra.com", password: "whatever" },
  { username: "magikarp", email: "magi@karp.com", password: "whatever" }
])

groups = Group.create([
  { title: "Shock Therapy", moderator_id: 1, description: "Get shocked by this therapy", city: "Marlton", state: "NJ", lat: 39.8522951, lng: -74.88579890000001 },
  { title: "ESP Enthusiasts", moderator_id: 4, description: "Hone your ESP skills", city: "Philadelphia", state: "PA", lat: 39.9525839, lng: -75.1652215 },
  { title: "Splash", moderator_id: 5, description: "Splash", city: "New York", state: "NY", lat: 40.7127837, lng: -74.0059413 }
])

memberships = Membership.create([
  { group_id: 1, member_id: 1 },
  { group_id: 1, member_id: 2 },
  { group_id: 1, member_id: 3 },
  { group_id: 1, member_id: 4 },
  { group_id: 1, member_id: 5 },
  { group_id: 2, member_id: 3 },
  { group_id: 2, member_id: 4 },
  { group_id: 2, member_id: 1 },
  { group_id: 3, member_id: 5 },
  { group_id: 3, member_id: 2 }
])
