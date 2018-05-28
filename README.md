

array of characters

every character has a json object of properties
one of those properties is knows about which references other characters / topics + level of depth



## Example

Eln knows that Breymin lives in the town of Kanbera

Select Eln
Ask if he knows Breymin
Eln says yes.
Ask where Breymin Lives
Eln says Kanbera
Ask what building Breymin lives in
Eln says he doesn't know what building Breymin lives in



X Character templates: multiple inheritance that fill out character attributes
example: Eln > Citizen of Kanbera


dialogue trigger words (where, when, what, who, why, should, could, can, may) with unique responses

questions vs statements

some sort of synonym replace

replace possessive: breymin's etc

X string property replace:  "I've been in [$character.residence.town] for a while now and I've not seen $subject

knows should be composed of a what (address to property) and a where (conditional statement, like the topic's name, or that the topic is a resident of a certain town etc)

find address for pieces even if full address isn't there ie: 'eln building' should find eln.residence.building