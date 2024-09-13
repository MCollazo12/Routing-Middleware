const ITEMS = require('./fakeDb');
const ExpressError = require('./expressError');

// Finds item by name in the ITEMS array
function findItemMiddleware(req, res, next) {
  const itemName = req.params.name.toLowerCase();
  const foundItem = ITEMS.find((item) => item.name.toLowerCase() === itemName);


  if (foundItem) {
    req.item = foundItem; //Attach found item to the request object
    next();
  } else {
    throw new ExpressError(`Sorry, '${itemName}' was not found.`, 404);
  }
}

// Add an item to the ITEMS array
function addItemMiddleware(req, res, next) {
  try {
    // Extract name and price from the request body
    const { name, price } = req.body;

    // Validate item name and price
    if (!name || name.trim() === '') {
      throw new ExpressError('Item name is required.', 400);
    }
    if (typeof price !== 'number' || isNaN(price) || price <= 0) {
      throw new ExpressError('A valid price is required.', 400);
    }

    // Create new item and add it to the array
    const newItem = { name: name.trim(), price: price };
    ITEMS.push(newItem);

    next();
  } catch (err) {
    next(err);
  }
}

// Updates an existing item by name
function patchItemMiddleware(req, res, next) {
  try {
    const itemName = req.params.name.toLowerCase();
    const { name, price } = req.body;

    // Find the index of the item in the ITEMS array
    const itemIndex = ITEMS.findIndex(
      (item) => item.name.toLowerCase() === itemName
    );

    // If item is not found, throw an error
    if (itemIndex === -1) {
      throw new ExpressError('Item was not found.', 404);
    }

    // Get the already existing item
    const item = ITEMS[itemIndex];

    // Name and price validation
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        throw new ExpressError('Item name is required.', 400);
      }
      item.name = name.trim(); // Update item name
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || isNaN(price) || price <= 0) {
        throw new ExpressError('Price must be a positive number.', 400);
      }
      item.price = price; // Update item price
    }

    //Attach updated item to the request object
    req.item = item;

    next();
  } catch (err) {
    next(err);
  }
}

// Delete an item by name from the ITEMS array
function deleteItemMiddleware(req, res, next) {
  try {
    // Find the index of the item
    const itemName = req.params.name.toLowerCase();
    const itemIndex = ITEMS.findIndex(
      (item) => item.name.toLowerCase() === itemName
    );

    // If item is not found, throw an error
    if (itemIndex === -1) {
      throw new ExpressError('Item was not found.', 404);
    }

    // Remove the item from the array and get the deleted item
    const deletedItem = ITEMS.splice(itemIndex, 1)[0];

    //Attach deleted item to the request object
    req.deletedItem = deletedItem;

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  findItemMiddleware,
  addItemMiddleware,
  patchItemMiddleware,
  deleteItemMiddleware,
};
