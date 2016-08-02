/**
 * @fileOverview  Defines error classes (also called "exception" classes)
 * @author Gerd Wagner
 */
function NoConstraintViolation() {
  this.message = "";
};
function ConstraintViolation( msg, culprit) {
  this.message = msg;
  if (culprit) this.culprit = culprit;
};

function MandatoryValueConstraintViolation( msg, culprit) {
  ConstraintViolation.call( this, msg, culprit);
};
MandatoryValueConstraintViolation.prototype = new ConstraintViolation();
MandatoryValueConstraintViolation.prototype.constructor = MandatoryValueConstraintViolation;

function RangeConstraintViolation( msg, culprit) {
  ConstraintViolation.call( this, msg, culprit);
};
RangeConstraintViolation.prototype = new ConstraintViolation();
RangeConstraintViolation.prototype.constructor = RangeConstraintViolation;

function StringLengthConstraintViolation( msg, culprit) {
  ConstraintViolation.call( this, msg, culprit);
};
StringLengthConstraintViolation.prototype = new ConstraintViolation();
StringLengthConstraintViolation.prototype.constructor = StringLengthConstraintViolation;

function IntervalConstraintViolation( msg, culprit) {
  ConstraintViolation.call( this, msg, culprit);
};
IntervalConstraintViolation.prototype = new ConstraintViolation();
IntervalConstraintViolation.prototype.constructor = IntervalConstraintViolation;

function PatternConstraintViolation( msg, culprit) {
  ConstraintViolation.call( this, msg, culprit);
};
PatternConstraintViolation.prototype = new ConstraintViolation();
PatternConstraintViolation.prototype.constructor = PatternConstraintViolation;

function UniquenessConstraintViolation( msg, culprit) {
  ConstraintViolation.call( this, msg, culprit);
};
UniquenessConstraintViolation.prototype = new ConstraintViolation();
UniquenessConstraintViolation.prototype.constructor = UniquenessConstraintViolation;

function ReferentialIntegrityConstraintViolation( msg, culprit) {
  ConstraintViolation.call( this, msg, culprit);
};
ReferentialIntegrityConstraintViolation.prototype = new ConstraintViolation();
ReferentialIntegrityConstraintViolation.prototype.constructor = ReferentialIntegrityConstraintViolation;

function FrozenValueConstraintViolation( msg, culprit) {
  ConstraintViolation.call( this, msg, culprit);
};
FrozenValueConstraintViolation.prototype = new ConstraintViolation();
FrozenValueConstraintViolation.prototype.constructor = FrozenValueConstraintViolation;

function OtherConstraintViolation( msg, culprit) {
  ConstraintViolation.call( this, msg, culprit);
};
OtherConstraintViolation.prototype = new ConstraintViolation();
OtherConstraintViolation.prototype.constructor = OtherConstraintViolation;
