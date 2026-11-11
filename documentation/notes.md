# Notes

For general notetaking, todos, and other miscellaneous thoughts.

## Product Punts

Elaborating on features we trimmed down and pushed back til later.

## Todos/Hardening Wishlist

- remove `enabled: true` from optimisticUpdateConfigs? We've never used it conditionally and it seems like we never will
  - is really just adding confusion
- use `useContext` on meeting page hierarchy to prevent prop throwing around
- for all the crazy optimistic update stuff on the meetinng actions and stuff, could we better use `optimisticUpdateValue` and `optimisticUpdateAttribute` to set a path on stuff? So instead of having an `updaterFn` do the nesting, just have it be a path?
- button theming with the colors is not fully updated to the changed color schemes
  - also button sizing with icon buttons, figure out the correct sizing/padding cause it was changed a few times
- now that we got rid of the "jump to transcript" and we now jump to the timestamp on the video, we can probably get rid of the transcriptIndex stuff on the indeces
- rework `rawStart` and `rawEnd` to be in milliseconds cause they're having to be converted and now idk what they're supposed to be my bad
