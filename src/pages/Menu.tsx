import React, { useState } from 'react';
import "../css/menu.css";
import { IMenu } from '../model/menu';

const initialTaskList: IMenu[] = [
  {
    id: 1,
    dishName: "Dish 1",
    description: "Description of Dish 1",
    price: 100,
    image: "/ཐིཋྀ.jfif",
  },
  {
    id: 2,
    dishName: "Dish 2",
    description: "Description of Dish 2",
    price: 200,
    image: "/загружено.jfif",
  },
  {
    id: 2,
    dishName: "Dish 3",
    description: "Description of Dish 3",
    price: 200,
    image: "/3.jfif",
  }
];

function Menu() {
  const [menu, setMenu] = useState<IMenu[]>(initialTaskList);
  const [editMenu, setEditMenu] = useState<{ id: number; field: string } | null>(null);
  const [inputValues, setInputValues] = useState<{ [key: number]: { [field: string]: string } }>({});

  const handleAddNew = () => {
    const newDish: IMenu = {
      id: menu.length + 1,
      dishName: `New Dish ${menu.length + 1}`,
      description: "This is a new description.",
      price: 0,
      image: "https://via.placeholder.com/100", // Заглушка
    };
    setMenu([newDish, ...menu]);
  };

  const handleEdit = (id: number, field: string) => {
    setEditMenu({ id, field });
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = (id: number, field: string) => {
    const updatedValue = inputValues[id]?.[field] || "";
    setMenu(menu.map((item) => (item.id === id ? { ...item, [field]: updatedValue } : item)));
    setEditMenu(null);
    setInputValues((prev) => {
      const updated = { ...prev };
      delete updated[id]?.[field];
      return updated;
    });
  };

  const handleImageChange = (id: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setMenu(menu.map((item) => 
        item.id === id ? { ...item, image: reader.result as string } : item
      ));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="MyWorkspace">
      <div className="description">
        <h3>Welcome to Workspace</h3>
      </div>

      <div className="tiles-container">
        <div className="tile add-new-tile" onClick={handleAddNew}>
          <span className="plus-icon">+</span>
          <p>Add New Dish</p>
        </div>

        {menu.map((item) => (
          <div key={item.id} className="tile">
          <div className="image-container">
            <img src={item.image} alt={item.dishName} className="dish-image" />
            {!item.image && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleImageChange(item.id, e.target.files[0])}
              />
            )}
          </div>
        
          {editMenu?.id === item.id && editMenu.field === "dishName" ? (
            <input
              type="text"
              value={inputValues[item.id]?.dishName || item.dishName}
              onChange={(e) => handleInputChange(item.id, "dishName", e.target.value)}
              onBlur={() => handleSave(item.id, "dishName")}
              autoFocus
            />
          ) : (
            <h3 onClick={() => handleEdit(item.id, "dishName")}>{item.dishName}</h3>
          )}
        
          {editMenu?.id === item.id && editMenu.field === "description" ? (
            <textarea
              value={inputValues[item.id]?.description || item.description}
              onChange={(e) => handleInputChange(item.id, "description", e.target.value)}
              onBlur={() => handleSave(item.id, "description")}
              autoFocus
            />
          ) : (
            <p onClick={() => handleEdit(item.id, "description")}>{item.description}</p>
          )}
        </div>
        
        ))}
      </div>
    </div>
  );
}

export default Menu;
