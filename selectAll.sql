SELECT users.id, users.first, users.last, users.email, signatures.user_id AS signed,
user_profiles.user_id, user_profiles.user_id AS profiled, user_profiles.age, user_profiles.city, user_profiles.url    
FROM signatures
FULL OUTER JOIN users
ON users.id = signatures.user_id
FULL OUTER JOIN user_profiles
ON users.id = user_profiles.user_id
ORDER BY users.id;