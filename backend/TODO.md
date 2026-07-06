# TODO - Fix build error

- [ ] Investigate TypeScript/Mongoose build error in `src/app/modules/role/role.model.ts` related to `strictPopulate` type mismatch.
- [ ] Update code to remove/adjust unsupported `roleSchema.set('strictPopulate', false)` usage so `npm run build` passes.
- [ ] Run `npm run build` to verify no TypeScript errors remain.
