-- Reaction upserts refresh the reaction timestamp together with its type.
GRANT UPDATE ("reacted_at") ON TABLE "social"."reaction" TO "authenticated";
