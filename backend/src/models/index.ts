import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';

// Database connection - Using PostgreSQL
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  : new Sequelize(
      process.env.DB_NAME || 'thinking_styles',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );

// User Types
export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  PARENT = 'parent',
  COUNSELOR = 'counselor',
  ADMIN = 'admin'
}

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

// User Interface
export interface IUserAttributes {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  gender?: UserGender;
  dateOfBirth?: Date;
  phoneNumber?: string;
  school?: string;
  grade?: string;
  parentEmail?: string;
  linkedStudents?: number[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreationAttributes extends Optional<IUserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'linkedStudents'> {}

// User Model
export class User extends Model<IUserAttributes, IUserCreationAttributes> implements IUserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public role!: UserRole;
  public gender?: UserGender;
  public dateOfBirth?: Date;
  public phoneNumber?: string;
  public school?: string;
  public grade?: string;
  public parentEmail?: string;
  public linkedStudents?: number[];
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public async hashPassword(): Promise<void> {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
}

// User Schema
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM(...Object.values(UserRole)),
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM(...Object.values(UserGender)),
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  school: {
    type: DataTypes.STRING,
    allowNull: true
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  parentEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  linkedStudents: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user: User) => {
      await user.hashPassword();
    },
    beforeUpdate: async (user: User) => {
      if (user.changed('password')) {
        await user.hashPassword();
      }
    }
  }
});

// Assessment Types
export enum AssessmentType {
  KOLB = 'kolb',
  STERNBERG = 'sternberg',
  DUAL_PROCESS = 'dual_process'
}

export interface IAssessmentQuestion {
  id: string;
  text: string;
  category: string;
  reverseScored?: boolean;
}

export interface IAssessmentResponse {
  questionId: string;
  score: number; // 1-5 Likert scale
}

// Assessment Interface
export interface IAssessmentAttributes {
  id: number;
  userId: number;
  type: AssessmentType;
  responses: IAssessmentResponse[];
  scores: { [key: string]: number };
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssessmentCreationAttributes extends Optional<IAssessmentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Assessment Model
export class Assessment extends Model<IAssessmentAttributes, IAssessmentCreationAttributes> implements IAssessmentAttributes {
  public id!: number;
  public userId!: number;
  public type!: AssessmentType;
  public responses!: IAssessmentResponse[];
  public scores!: { [key: string]: number };
  public completedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Assessment Schema
Assessment.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM(...Object.values(AssessmentType)),
    allowNull: false
  },
  responses: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  scores: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Assessment',
  tableName: 'assessments',
  timestamps: true
});

// Report Types
export interface IReportAttributes {
  id: number;
  userId: number;
  assessments: number[]; // Assessment IDs
  overallProfile: {
    primaryStyle: string;
    secondaryStyle: string;
    strengths: string[];
    recommendations: string[];
  };
  educationMapping: {
    recommendedSHS: string[];
    recommendedTertiary: string[];
    careerSuggestions: string[];
  };
  insights: {
    learningPreferences: string[];
    decisionMakingStyle: string;
    communicationStyle: string;
  };
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReportCreationAttributes extends Optional<IReportAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Report Model
export class Report extends Model<IReportAttributes, IReportCreationAttributes> implements IReportAttributes {
  public id!: number;
  public userId!: number;
  public assessments!: number[];
  public overallProfile!: {
    primaryStyle: string;
    secondaryStyle: string;
    strengths: string[];
    recommendations: string[];
  };
  public educationMapping!: {
    recommendedSHS: string[];
    recommendedTertiary: string[];
    careerSuggestions: string[];
  };
  public insights!: {
    learningPreferences: string[];
    decisionMakingStyle: string;
    communicationStyle: string;
  };
  public generatedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Report Schema
Report.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  assessments: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  overallProfile: {
    type: DataTypes.JSON,
    allowNull: false
  },
  educationMapping: {
    type: DataTypes.JSON,
    allowNull: false
  },
  insights: {
    type: DataTypes.JSON,
    allowNull: false
  },
  generatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Report',
  tableName: 'reports',
  timestamps: true
});

// Reflection Types
export interface IReflectionAttributes {
  id: number;
  userId: number;
  reportId: number;
  content: string;
  rating: number; // 1-5 scale
  createdAt: Date;
  updatedAt: Date;
}

export interface IReflectionCreationAttributes extends Optional<IReflectionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Reflection Model
export class Reflection extends Model<IReflectionAttributes, IReflectionCreationAttributes> implements IReflectionAttributes {
  public id!: number;
  public userId!: number;
  public reportId!: number;
  public content!: string;
  public rating!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Reflection Schema
Reflection.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  reportId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Report,
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 1000]
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Reflection',
  tableName: 'reflections',
  timestamps: true
});

// Define associations
User.hasMany(Assessment, { foreignKey: 'userId', as: 'assessments' });
Assessment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Report, { foreignKey: 'userId', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Reflection, { foreignKey: 'userId', as: 'reflections' });
Reflection.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Report.hasMany(Reflection, { foreignKey: 'reportId', as: 'reflections' });
Reflection.belongsTo(Report, { foreignKey: 'reportId', as: 'report' });

// Database connection function
export const connectDatabase = async (): Promise<void> => {
  try {
    // Add retry logic for initial connection
    let retries = 3;
    let lastError;
    
    while (retries > 0) {
      try {
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL database');
        break;
      } catch (error) {
        lastError = error;
        retries--;
        if (retries > 0) {
          console.log(`⚠️ Connection failed, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    if (retries === 0) {
      throw lastError;
    }
    
    // Sync models (create tables if they don't exist)
    // Changed from force: true to alter: true to preserve data
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
  }
};

export default sequelize;