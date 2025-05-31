// models/relation.model.js
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const InstanceRelation = require('./instanceRelation.model');

const relationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    // Common types are: composition, association, inheritance. Default to be 'custom'
    type: {
      type: String,
      trim: true,
      required: true,
      index: true,
      default: 'custom',
    },
    description: {
      type: String,
      trim: true,
    },
    // The schema where the relation originates
    source: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Schema',
      required: true,
      index: true,
    },
    // The schema the relation points to
    target: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Schema',
      required: true,
      index: true,
    },
    // Optional: Cardinality of relation
    source_cardinality: {
      type: String,
      enum: ['one-to-one', 'zero-to-one', 'one-to-many', 'zero-to-many'],
    },
    target_cardinality: {
      type: String,
      enum: ['one-to-one', 'zero-to-one', 'one-to-many', 'zero-to-many'],
    },
    source_role_name: {
      type: String,
    },
    target_role_name: {
      type: String,
    },
    is_core: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.SchemaTypes.Mixed,
    },
    created_by: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Add index for common lookups & unique
relationSchema.index({ source: 1, target: 1, type: 1 }, { unique: true });

// Add plugins
relationSchema.plugin(toJSON);
relationSchema.plugin(paginate);

relationSchema.post('remove', async function (_, next) {
  try {
    const instanceRelations = await InstanceRelation.find({
      relation: this._id,
    });
    await Promise.all(instanceRelations.map((ir) => ir.remove()));
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * @typedef Relation
 */
const Relation = mongoose.model('Relation', relationSchema);

module.exports = Relation;
