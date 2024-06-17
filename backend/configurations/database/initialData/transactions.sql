INSERT INTO transactions (
  "transactionId",
  "name",
  "description",
  amount,
  "accountNumberOrigin",
  "currencyOrigin",
  "accountNumberDestination",
  "currencyDestination",
  "status",
  "date",
  "createdAt",
  "updatedAt"
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000', -- transactionId (UUID)
  'Transferencia', -- name
  'Transferencia de prueba', -- description
  100.0, -- amount
  '0x829745F0Da95DDb972031F9a376F310C4e106933', -- accountNumberOrigin
  'XCN', -- currencyOrigin
  '0xC4F62440D40006b57C7b639521578424270D7497', -- accountNumberDestination
  'XCN', -- currencyDestination
  'pending', -- status
  '2024-06-15 12:00:00', -- date (YYYY-MM-DD HH:MM:SS format)
  '2024-06-15 12:00:00', -- createdAt (YYYY-MM-DD HH:MM:SS format)
  '2024-06-15 12:00:00' -- updatedAt (YYYY-MM-DD HH:MM:SS format)
);

UPDATE users
SET "userStatus" =  'validated'
WHERE "email" = 'caso2@gmail.com';