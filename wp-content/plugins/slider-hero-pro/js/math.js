 const MyMath = (function MyMathFactory(Math) {

	const MyMath = {};


	// degree/radian conversion constants
	MyMath.toDeg = 180 / Math.PI;
	MyMath.toRad = Math.PI / 180;
	MyMath.halfPI = Math.PI / 2;
	MyMath.twoPI = Math.PI * 2;

	// Pythagorean Theorem point distance calculation
	MyMath.pointDist = (x1, y1, x2, y2) => {
		const distX = x2 - x1;
		const distY = y2 - y1;
		return Math.sqrt(distX * distX + distY * distY);
	};

	// Returns the angle (in radians) between two points
	MyMath.pointAngle = (x1, y1, x2, y2) => ( MyMath.halfPI + Math.atan2(y2 - y1, x2 - x1) );

	// Splits a speed vector into x and y components (angle needs to be in radians)
	MyMath.splitVector = (speed, angle) => ({
		x: Math.sin(angle) * speed,
		y: -Math.cos(angle) * speed
	});

	// Generates a random integer between and possibly including min and max values
	MyMath.randomInt = (min, max) => ( ((Math.random() * (max - min + 1)) | 0) + min );

	// Returns a random element from an array, or simply the set of provided arguments when called
	MyMath.randomChoice = function randomChoice(choices) {
		if (arguments.length === 1 && Array.isArray(choices)) {
			return choices[(Math.random() * choices.length) | 0];
		}
		return arguments[(Math.random() * arguments.length) | 0];
	};


	return MyMath;

})(Math);